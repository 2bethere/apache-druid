SELECT LEAD(col0 ) OVER ( PARTITION BY col2 ORDER BY col0 nulls LAST ) LEAD_col0 FROM "fewRowsAllData.parquet"