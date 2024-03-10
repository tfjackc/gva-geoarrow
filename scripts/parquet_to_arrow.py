from pathlib import Path
import os
import geopandas as gpd
import pandas as pd
import pyarrow as pa
import pyarrow.feather as feather
import shapely
from shapely import wkb
from lonboard._geoarrow.geopandas_interop import geopandas_to_geoarrow
from lonboard.colormap import apply_continuous_cmap
from palettable.colorbrewer.sequential import YlOrRd_9
#for i in range(5,12,1):
parquet_file = f"partitioned_data\MONTH=2020-12\\12.parquet"
df = pd.read_parquet(parquet_file)

activity_index = df['ACTIVITY_INDEX_TOTAL']
min_bound = activity_index.min()
max_bound = activity_index.max()

transformed_activity_index = np.sqrt(activity_index - min_bound)
normalized_transformed_index = (transformed_activity_index - transformed_activity_index.min()) / (transformed_activity_index.max() - transformed_activity_index.min())
colors = apply_continuous_cmap(normalized_transformed_index, YlOrRd_9)
# plt.hist(normalized_transformed_index, bins=50)
# plt.title('Distribution of Transformed Activity Index')
# plt.xlabel('Normalized Value')
# plt.ylabel('Frequency')
# plt.show()

df['geometry'] = df['GEOMETRY'].apply(lambda x: wkb.loads(x) if x is not None else None)

# Now create the GeoDataFrame using the converted 'geometry' column
gdf = gpd.GeoDataFrame(df, geometry='geometry')

table = geopandas_to_geoarrow(gdf, preserve_index=False)
table = table.append_column(
        "colors", pa.FixedSizeListArray.from_arrays(colors.flatten("C"), 3)
    )
feather.write_feather(
        table, f"movement_wbounds_12.feather", compression="uncompressed"
    )