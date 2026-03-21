import json
import math

def extract_data():
    with open('planet_data_full.json', 'r') as f:
        data = json.load(f)
    
    planets_to_extract = [
        'Altiplano', 'Olympia', 'Concord', 'Damso', 'Medina', 
        'NovayeNuevo', 'Pacifica', 'Refuge', 'Schwarzvaal', 'XingCheng'
    ]
    
    results = {}
    
    # Pre-extract moon data from Summary sheet
    summary = data.get('Summary', [])
    moon_map = {}
    
    # In Summary, colony names are often in Unnamed: 0 or Unnamed: 1 etc
    # Let's try to find rows starting with 'a - Altiplano', etc.
    # Actually, let's look for specific columns.
    
    for p_key in planets_to_extract:
        sheet = data.get(p_key, [])
        p_data = {}
        
        js_name = 'Novaya' if p_key == 'NovayeNuevo' else ('Xing Cheng' if p_key == 'XingCheng' else p_key)
        
        for row in sheet:
            row_values_set = {str(v) for v in row.values()}
            if 'Mean Atmospheric Pressure' in row_values_set:
                p_data['atmPressure'] = row.get('Unnamed: 4')
            if 'O2 %' in row_values_set: p_data['atmo_O2'] = row.get('Unnamed: 2')
            if 'N2 %' in row_values_set: p_data['atmo_N2'] = row.get('Unnamed: 2')
            if 'CO2 %' in row_values_set: p_data['atmo_CO2'] = row.get('Unnamed: 2')
            if 'Surf Temp' in row_values_set:
                p_data['surfTempK'] = row.get('Unnamed: 1')
            if 'Hydrosphere %' in row_values_set:
                p_data['hydroPercent'] = row.get('Unnamed: 2')
            if 'magnetopause ht ' in row_values_set:
                p_data['magnetopauseHt'] = row.get('Unnamed: 1')

            # Fallback for Moon Data from individual sheet if it exists
            if row.get('Planetary Parameters') == 'Lunar Data' or 'Lunar Data' in row_values_set:
                p_data['moonDiameter'] = row.get('Unnamed: 1')
                p_data['moonDist'] = row.get('Unnamed: 9')

        # Clean up NaNs
        for k, v in p_data.items():
            if isinstance(v, float) and math.isnan(v):
                p_data[k] = None

        results[js_name] = p_data
        
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    extract_data()
