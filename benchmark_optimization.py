import json
import math
import time
import random

def generate_dummy_data(num_planets=10, rows_per_planet=1000):
    planets = [
        'Altiplano', 'Olympia', 'Concord', 'Damso', 'Medina',
        'NovayeNuevo', 'Pacifica', 'Refuge', 'Schwarzvaal', 'XingCheng'
    ]
    data = {}

    potential_keys = ['Unnamed: 0', 'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 9', 'Planetary Parameters']

    targets = [
        'Mean Atmospheric Pressure', 'O2 %', 'N2 %', 'CO2 %', 'Surf Temp',
        'Hydrosphere %', 'magnetopause ht ', 'Lunar Data'
    ]

    for p in planets:
        sheet = []
        for i in range(rows_per_planet):
            row = {k: (random.random() if k != 'Planetary Parameters' else 'Some Param') for k in potential_keys}
            # Occasionally insert a target value
            if i % 100 == 0:
                target = random.choice(targets)
                key_to_place = random.choice(potential_keys[:-1]) # Don't overwrite Planetary Parameters usually
                row[key_to_place] = target
                if target == 'Lunar Data' and random.random() > 0.5:
                    row['Planetary Parameters'] = 'Lunar Data'
            sheet.append(row)
        data[p] = sheet

    return data

def original_extract_data(data):
    planets_to_extract = [
        'Altiplano', 'Olympia', 'Concord', 'Damso', 'Medina',
        'NovayeNuevo', 'Pacifica', 'Refuge', 'Schwarzvaal', 'XingCheng'
    ]
    results = {}
    for p_key in planets_to_extract:
        sheet = data.get(p_key, [])
        p_data = {}
        js_name = 'Novaya' if p_key == 'NovayeNuevo' else ('Xing Cheng' if p_key == 'XingCheng' else p_key)

        for row in sheet:
            row_values = [str(v) for v in row.values()]
            if 'Mean Atmospheric Pressure' in row_values:
                p_data['atmPressure'] = row.get('Unnamed: 4')
            if 'O2 %' in row_values: p_data['atmo_O2'] = row.get('Unnamed: 2')
            if 'N2 %' in row_values: p_data['atmo_N2'] = row.get('Unnamed: 2')
            if 'CO2 %' in row_values: p_data['atmo_CO2'] = row.get('Unnamed: 2')
            if 'Surf Temp' in row_values:
                p_data['surfTempK'] = row.get('Unnamed: 1')
            if 'Hydrosphere %' in row_values:
                p_data['hydroPercent'] = row.get('Unnamed: 2')
            if 'magnetopause ht ' in row_values:
                p_data['magnetopauseHt'] = row.get('Unnamed: 1')

        for row in sheet:
            if row.get('Planetary Parameters') == 'Lunar Data' or 'Lunar Data' in [str(v) for v in row.values()]:
                p_data['moonDiameter'] = row.get('Unnamed: 1')
                p_data['moonDist'] = row.get('Unnamed: 9')

        for k, v in p_data.items():
            if isinstance(v, float) and math.isnan(v):
                p_data[k] = None
        results[js_name] = p_data
    return results

def highly_optimized_extract_data(data):
    planets_to_extract = [
        'Altiplano', 'Olympia', 'Concord', 'Damso', 'Medina',
        'NovayeNuevo', 'Pacifica', 'Refuge', 'Schwarzvaal', 'XingCheng'
    ]
    results = {}
    for p_key in planets_to_extract:
        sheet = data.get(p_key, [])
        p_data = {}
        js_name = 'Novaya' if p_key == 'NovayeNuevo' else ('Xing Cheng' if p_key == 'XingCheng' else p_key)

        for row in sheet:
            # Use a set of stringified values for O(1) lookup
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

            if row.get('Planetary Parameters') == 'Lunar Data' or 'Lunar Data' in row_values_set:
                p_data['moonDiameter'] = row.get('Unnamed: 1')
                p_data['moonDist'] = row.get('Unnamed: 9')

        for k, v in p_data.items():
            if isinstance(v, float) and math.isnan(v):
                p_data[k] = None
        results[js_name] = p_data
    return results

def optimized_extract_data(data):
    planets_to_extract = [
        'Altiplano', 'Olympia', 'Concord', 'Damso', 'Medina',
        'NovayeNuevo', 'Pacifica', 'Refuge', 'Schwarzvaal', 'XingCheng'
    ]
    results = {}
    for p_key in planets_to_extract:
        sheet = data.get(p_key, [])
        p_data = {}
        js_name = 'Novaya' if p_key == 'NovayeNuevo' else ('Xing Cheng' if p_key == 'XingCheng' else p_key)

        for row in sheet:
            row_values = [str(v) for v in row.values()]
            if 'Mean Atmospheric Pressure' in row_values:
                p_data['atmPressure'] = row.get('Unnamed: 4')
            if 'O2 %' in row_values: p_data['atmo_O2'] = row.get('Unnamed: 2')
            if 'N2 %' in row_values: p_data['atmo_N2'] = row.get('Unnamed: 2')
            if 'CO2 %' in row_values: p_data['atmo_CO2'] = row.get('Unnamed: 2')
            if 'Surf Temp' in row_values:
                p_data['surfTempK'] = row.get('Unnamed: 1')
            if 'Hydrosphere %' in row_values:
                p_data['hydroPercent'] = row.get('Unnamed: 2')
            if 'magnetopause ht ' in row_values:
                p_data['magnetopauseHt'] = row.get('Unnamed: 1')

            # Combined loop and reuse row_values
            if row.get('Planetary Parameters') == 'Lunar Data' or 'Lunar Data' in row_values:
                p_data['moonDiameter'] = row.get('Unnamed: 1')
                p_data['moonDist'] = row.get('Unnamed: 9')

        for k, v in p_data.items():
            if isinstance(v, float) and math.isnan(v):
                p_data[k] = None
        results[js_name] = p_data
    return results

if __name__ == "__main__":
    print("Generating dummy data...")
    dummy_data = generate_dummy_data(rows_per_planet=10000)

    print("Running baseline...")
    start = time.time()
    res1 = original_extract_data(dummy_data)
    end = time.time()
    baseline_time = end - start
    print(f"Baseline time: {baseline_time:.4f}s")

    print("Running optimized...")
    start = time.time()
    res2 = optimized_extract_data(dummy_data)
    end = time.time()
    optimized_time = end - start
    print(f"Optimized time: {optimized_time:.4f}s")

    print(f"Improvement (Opt): {(baseline_time - optimized_time) / baseline_time * 100:.2f}%")

    print("Running highly optimized...")
    start = time.time()
    res3 = highly_optimized_extract_data(dummy_data)
    end = time.time()
    h_optimized_time = end - start
    print(f"Highly Optimized time: {h_optimized_time:.4f}s")
    print(f"Improvement (Highly Opt): {(baseline_time - h_optimized_time) / baseline_time * 100:.2f}%")

    # Verify results are the same
    if res1 == res2 == res3:
        print("Verification SUCCESS: Results match!")
    else:
        print("Verification FAILED: Results differ!")
