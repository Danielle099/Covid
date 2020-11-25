const Pool = require('pg').Pool
const pool = new Pool({
  user: 'monteljn',
  host: 'localhost',
  database: 'monteljn',
  password: 'Und]Cif6',
  port: 5432,
  multipleStatements: true,
})
console.log("HELLO")


 const getCounties = (request, response) => {
  //pool.query('SELECT county, cases FROM county where county=\'Warren\'', (error, results) => {
  pool.query('create table cases as (SELECT unnest(array[\'Carbon\',\'Lehigh\',\'Northampton\',\'Warren\']) AS county,unnest(array[max(Carbon),max(Lehigh),max(Northampton),max(Warren)]) AS cases from countycases);update county set cases = cases.cases from cases where county.county = cases.county;drop table cases;create table deaths as (SELECT unnest(array[\'Carbon\',\'Lehigh\',\'Northampton\',\'Warren\']) AS county,unnest(array[max(Carbon),max(Lehigh),max(Northampton),max(Warren)]) AS deaths from countydeaths);update county set deaths = deaths.deaths from deaths where county.county = deaths.county; drop table deaths; select * from county', (error, results) => {

if (error) {
       throw error
     }
     response.status(200).json(results[6].rows)
     console.log(results.rows)
   })
 }


const getCountyIncidence = (request, response) => {
    pool.query('drop table if exists inctotal; create table cases as (SELECT unnest(array[\'Carbon\',\'Lehigh\',\'Northampton\',\'Warren\']) AS county,unnest(array[max(Carbon),max(Lehigh),max(Northampton),max(Warren)]) AS cases from countycases);update county set cases = cases.cases from cases where county.county = cases.county;drop table cases;create table deaths as (SELECT unnest(array[\'Carbon\',\'Lehigh\',\'Northampton\',\'Warren\']) AS county,unnest(array[max(Carbon),max(Lehigh),max(Northampton),max(Warren)]) AS deaths from countydeaths);update county set deaths = deaths.deaths from deaths where county.county = deaths.county; drop table deaths;create table inctotal as (with w as (select county, sum(cases) cases, sum(population) population from county group by county) select * from w union all select \'Lehigh Valley\', sum(cases), sum(population) from w);alter table inctotal add column inc float; update inctotal set inc = 1000*(cases/population); select county, inc from inctotal;drop table inctotal' , (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results[10].rows)
      console.log(results[10].rows)
    })
  }

const getIncidenceLine = (request, response) => {
    pool.query('drop table if exists incidence; create table incidence as select distinct to_char(date, \'YYYY-MM-DD\') as date, (cast(carbon as numeric(10,4))/(select population from county where county=\'Carbon\') * 1000) as carbonInc, (cast(warren as numeric(10,4))/(select population from county where county=\'Warren\') * 1000) as warrenInc, (cast(lehigh as numeric(10,4))/(select population from county where county=\'Lehigh\') * 1000) as lehighInc, (cast(northampton as numeric(10,4))/(select population from county where county=\'Northampton\') * 1000) as NorthamptonInc from countycases, county order by date asc; select * from incidence; drop table if exists incidence', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results[2].rows)
        console.log(results[2].rows)
    })
}

const getCollegeTotals = (request, response) => {
  pool.query('select Distinct college_name, sum(covid_cases) total from college group by college_name', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
    console.log(results.rows)
  })
}

const getWeekCol = (request, response) => {
      pool.query('drop table if exists weekcolleges; create table weekcolleges as select to_char(college.week, \'YYYY-MM-DD\') as week,MAX(CASE WHEN college.college_name = \'Lafayette College\' THEN college.covid_cases END) AS Lafayette,MAX(CASE WHEN college.college_name like \'%Lehigh_University%\' THEN college.covid_cases END) AS lehigh,MAX(CASE WHEN college.college_name = \'Moravian College\' THEN college.covid_cases END) AS moravian,MAX(CASE WHEN college.college_name = \'Cedar crest\' THEN college.covid_cases END) AS cedar_crest,MAX(CASE WHEN college.college_name = \'Penn state lehigh\' THEN college.covid_cases END) AS penn_state_lehigh,MAX(CASE WHEN college.college_name = \'Desales University\' THEN college.covid_cases END) AS desales,MAX(CASE WHEN college.college_name like \'%Muhlenberg_College%\' THEN college.covid_cases END) AS muhlenberg from college group by college.week;update weekcolleges set lafayette = 0 where lafayette is NULL;update weekColleges set lehigh = 0 where lehigh is NULL;update weekColleges set moravian = 0 where moravian is NULL;update weekColleges set cedar_crest = 0 where cedar_crest is NULL;update weekColleges set penn_state_lehigh = 0 where penn_state_lehigh is NULL; update weekColleges set desales = 0 where desales is NULL;update weekColleges set muhlenberg = 0 where muhlenberg is NULL;select * from weekColleges order by week asc;drop table if exists weekcolleges',(error, results) => {
      if (error) {
       throw error
      }
      response.status(200).json(results[9].rows)
      console.log(results[9].rows)
    })
  }


 const getCasesTotal = (request, response) => {
pool.query('drop table if exists totals; SELECT unnest(array[\'Carbon\',\'Lehigh\',\'Northampton\',\'Warren\']) AS county,unnest(array[max(Carbon),max(Lehigh),max(Northampton),max(Warren)]) AS cases from countycases; create table cases as (SELECT unnest(array[\'Carbon\',\'Lehigh\',\'Northampton\',\'Warren\']) AS county,unnest(array[max(Carbon),max(Lehigh),max(Northampton),max(Warren)]) AS cases from countycases); update county set cases = cases.cases from cases where county.county = cases.county; create table deaths as (SELECT unnest(array[\'Carbon\',\'Lehigh\',\'Northampton\',\'Warren\']) AS county,unnest(array[max(Carbon),max(Lehigh),max(Northampton),max(Warren)]) AS deaths from countydeaths); update county set deaths = deaths.deaths from deaths where county.county = deaths.county; drop table if exists deaths; drop table if exists cases; create table totals as (select Distinct college_name, sum(covid_cases) total from college group by college_name);  alter table totals rename column college_name to area; insert into totals(area, total) values (\'Carbon County\', (select cases from county where county=\'Carbon\')); insert into totals(area, total) values (\'Lehigh County\', (select cases from county where county=\'Lehigh\')); insert into totals(area, total) values (\'Northampton County\', (select cases from county where county=\'Northampton\')); insert into totals(area, total) values (\'Warren County\', (select cases from county where county=\'Warren\')); select * from totals; drop table if exists totals', (error, results) => {
  if (error) {
        throw error
      }
      response.status(200).json(results[14].rows)
      console.log(results[14].rows)
  })
 }

module.exports = {
        getCounties,
        getCountyIncidence,
        getCollegeTotals,
        getWeekCol,
        getCasesTotal,
        getIncidenceLine
     }
