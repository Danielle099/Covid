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
  //pool.query('SELECT * FROM county', (error, results) => {
  pool.query('drop table if exists temp1; drop table if exists newCounty; create table temp1 as select county, sum(deaths) as deaths, sum(cases) as cases from new_cases group by county; create table newCounty as select county.county, (temp1.cases + county.cases) as cases, (temp1.deaths + county.deaths) as deaths, population, latitude, longitude from county, temp1 where temp1.county=county.county; SELECT * FROM newCounty', (error, results) => {

if (error) {
       throw error
     }
     response.status(200).json(results[4].rows)
     console.log(results.rows)
   })
 }


//const getCounties = (request, response) => {
 // pool.query('drop table IF EXISTS countytotals; drop table IF EXISTS totals; create table countytotals as (select sum(carbon) as CarbonTotal, sum(lehigh) as LehighTotal, sum(northampton) as NorthamptonTotal, sum(warren) as Warrentotal from countycases); create table totals(county text, total decimal); insert into totals(area, total) values ('Carbon County', (select carbontotal from countytotals)); insert into totals(area, total) values ('Lehigh County', (select lehightotal from countytotals)); insert into totals(area, total) values ('Northampton County', (select northamptontotal from countytotals)); insert into totals(area, total) values ('Warren County', (select warrentotal from countytotals)); select * from totals', (error, results) => {
   // if (error) {
     // throw error
   // }
    //response.status(200).json(results.rows)
   // console.log(results[8].rows)
 // })
//}


const getCountyIncidence = (request, response) => {

    pool.query('drop table IF EXISTS countyIncidence; create table countyIncidence as select round(SUM(carbon)/1000,0) as carbonInc,round(SUM(warren)/1000,0) as warrenInc,round(SUM(lehigh)/1000,0) as lehighInc,round(SUM(northampton )/1000,0) as northamptonInc from countycases;select *from countyIncidence', (error, results) => {
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
  pool.query('drop table IF EXISTS t1; drop table IF EXISTS weekColleges1; drop table IF EXISTS weekColleges2; drop table IF EXISTS weekColleges3; drop table IF EXISTS weekColleges4; drop table IF EXISTS weekColleges; create table t1 as select lafayette.week, lafayette.lafayette, lehigh.lehigh from lafayette left join lehigh on lafayette.week = lehigh.week; create table weekColleges1 as select t1.week, t1.lafayette, t1.lehigh, moravian.moravian from t1 left join moravian on t1.week = moravian.week; create table weekColleges2 as select weekColleges1.week, weekColleges1.lafayette, weekColleges1.lehigh, weekColleges1.moravian, cedar.Cedar_crest from weekColleges1 left join cedar on weekColleges1.week = cedar.week; create table weekColleges3 as select weekColleges2.week, weekColleges2.lafayette, weekColleges2.lehigh, weekColleges2.moravian, weekColleges2.Cedar_crest, penn.Penn_state_lehigh from weekColleges2 left join penn on weekColleges2.week = penn.week; create table weekColleges4 as select weekColleges3.week, weekColleges3.lafayette, weekColleges3.lehigh, weekColleges3.moravian, weekColleges3.Cedar_crest, weekColleges3.Penn_state_lehigh, desales.Desales from weekColleges3 left join desales on weekColleges3.week = desales.week; create table weekColleges as select weekColleges4.week, weekColleges4.lafayette, weekColleges4.lehigh, weekColleges4.moravian, weekColleges4.Cedar_crest, weekColleges4.Penn_state_lehigh, weekColleges4.Desales, muhlenberg.Muhlenberg from weekColleges4 left join muhlenberg on weekColleges4.week = muhlenberg.week; update weekColleges set lafayette = 0 where lafayette is NULL; update weekColleges set lehigh = 0 where lehigh is NULL; update weekColleges set moravian = 0 where moravian is NULL; update weekColleges set cedar_crest = 0 where cedar_crest is NULL; update weekColleges set Penn_state_lehigh = 0 where Penn_state_lehigh is NULL; update weekColleges set desales = 0 where desales is NULL; update weekColleges set muhlenberg = 0 where muhlenberg is NULL; select * from weekColleges ORDER BY week ASC', (error, results) => {
  if (error) {
       throw error
      }
      response.status(200).json(results[19].rows)
      console.log(results.rows)
    })
  }


 const getCasesTotal = (request, response) => {
//    pool.query('drop table IF EXISTS totals; drop table IF EXISTS countytotals; create table totals as (select Distinct college_name, sum(covid_cases) total from college group by college_name); alter table totals rename column college_name to area; create table countytotals as (select sum(carbon) as CarbonTotal, sum(lehigh) as LehighTotal, sum(northampton) as NorthamptonTotal, sum(warren) as Warrentotal from countycases); insert into totals(area, total) values ('Carbon County', (select carbontotal from countytotals)); insert into totals(area, total) values ('Lehigh County', (select lehightotal from countytotals)); insert into totals(area, total) values ('Northampton County', (select northamptontotal from countytotals)); insert into totals(area, total) values ('Warren County', (select warrentotal from countytotals)); select * from totals;', (error, results) => {
  pool.query('select * from totals', (error, results) => {
  if (error) {
        throw error
      }
      response.status(200).json(results.rows)
      console.log(results.rows)
  })
 }

module.exports = {
        getCounties,
        getCountyIncidence,
        getCollegeTotals,
        getWeekCol,
        getCasesTotal
}
