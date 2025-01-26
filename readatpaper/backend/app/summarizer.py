import findspark
findspark.init()

from pyspark.sql import SparkSession

# Create a Spark session
spark = SparkSession.builder.appName("JupyterSpark").getOrCreate()

# Check Spark session
print("Spark version:", spark.version)