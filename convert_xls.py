import pandas as pd
import os
import json

def convert_excel(file_path):
    # Create an output directory for CSVs
    output_dir = "extracted_data"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")

    print(f"Reading {file_path}...")
    
    # Load the Excel file (requires 'xlrd' for .xls files)
    try:
        excel_data = pd.read_excel(file_path, sheet_name=None)
    except ImportError:
        print("Error: The 'xlrd' library is required to read .xls files.")
        print("Please run: pip install xlrd pandas")
        return

    all_data = {}

    for sheet_name, df in excel_data.items():
        # 1. Save as CSV
        csv_filename = os.path.join(output_dir, f"{sheet_name.replace(' ', '_')}.csv")
        df.to_csv(csv_filename, index=False)
        print(f"Saved sheet '{sheet_name}' to {csv_filename}")

        # 2. Add to dictionary for JSON (convert to list of dicts)
        # Handle NaN values for JSON compatibility
        all_data[sheet_name] = df.where(pd.notnull(df), None).to_dict(orient='records')

    # 3. Save as single JSON file
    json_filename = "planet_data_full.json"
    
    def datetime_handler(x):
        if hasattr(x, 'isoformat'):
            return x.isoformat()
        return str(x)

    with open(json_filename, 'w') as f:
        json.dump(all_data, f, indent=2, default=datetime_handler)
    print(f"Saved all data to {json_filename}")

if __name__ == "__main__":
    file_name = "Planet-FilterRev9-2.xls"
    if os.path.exists(file_name):
        convert_excel(file_name)
    else:
        print(f"Error: {file_name} not found in the current directory.")
