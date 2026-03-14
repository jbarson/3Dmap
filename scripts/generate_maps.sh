#!/bin/bash

# Configuration: Adjust these to fine-tune the maps
BUMP_CONTRAST=1.5
SPECULAR_CONTRAST=2.0
NIGHT_BRIGHTNESS=0.05
NIGHT_CONTRAST=2.5

# Planet map base names
PLANETS=("Earth" "Map_Altiplano" "Map_Concord" "Map_Damso" "Map_Medina" "Map_Novaya" "Map_Olympia" "Map_Pacifica" "Map_Refuge" "Map_Schwartzvaal" "Map_XingCheng")

# Function to get the correct input file (prefer .png, then .jpg)
get_input_file() {
    local base=$1
    if [[ -f "public/pngs/$base.png" ]]; then
        echo "public/pngs/$base.png"
    elif [[ -f "public/pngs/$base.jpg" ]]; then
        echo "public/pngs/$base.jpg"
    fi
}

echo "Generating realistic map layers for all planets..."

for base in "${PLANETS[@]}"; do
    INPUT=$(get_input_file "$base")
    if [[ -z "$INPUT" ]]; then
        echo "Skipping $base: input file not found."
        continue
    fi

    echo "Processing $base from $INPUT..."

    # 1. Generate BUMP MAP (Grayscale heightmap)
    # Convert to grayscale, boost contrast for visible terrain details.
    magick "$INPUT" -colorspace gray -auto-level -sigmoidal-contrast "$BUMP_CONTRAST,50%" "public/pngs/${base}_bump.png"
    echo "  - Created ${base}_bump.png"

    # 2. Generate SPECULAR MAP (Shiny vs. Dull)
    # Usually water is shiny (white in spec map) and land is dull (black).
    # Since most of these are procedural, we'll assume dark areas = water/lowlands.
    # We'll invert and contrast-boost so dark spots are highly reflective.
    magick "$INPUT" -colorspace gray -negate -auto-level -sigmoidal-contrast "$SPECULAR_CONTRAST,50%" "public/pngs/${base}_specular.png"
    echo "  - Created ${base}_specular.png"

    # 3. Generate NIGHT MAP (Simulated city lights)
    # Take the grayscale, crush blacks, and only keep the brightest spots (simulated lights).
    magick "$INPUT" -colorspace gray -gamma "$NIGHT_BRIGHTNESS" -sigmoidal-contrast "$NIGHT_CONTRAST,95%" "public/pngs/${base}_night.png"
    echo "  - Created ${base}_night.png"

done

echo "Done! Refresh your browser to see the detail on the cinematic globe."
