#include <iostream>
#include <cmath>
#include <SDL2/SDL.h>
#include <libnoise/noise.h>
#include <ctime>

// Define the width and height of your planet's height map
const int PLANET_SIZE = 128;
const int WINDOW_SCALE = 5; // Increase to make the planet bigger

// Function to generate Perlin noise height map within a circular boundary
void generateHeightMap(double heightMap[PLANET_SIZE][PLANET_SIZE]) {
    // Create a Perlin noise module
    noise::module::Perlin perlinModule;
    perlinModule.SetFrequency(0.4);

    std::srand(std::time(nullptr));
    perlinModule.SetSeed(rand());

    // Define the radius of the circle
    double radius = std::min(PLANET_SIZE, PLANET_SIZE) / 2.0;

    // Loop through each point in the height map
    for (int x = 0; x < PLANET_SIZE; ++x) {
        for (int y = 0; y < PLANET_SIZE; ++y) {
            // Calculate the distance from the center of the height map
            double distance = std::sqrt(std::pow(x - PLANET_SIZE / 2.0, 2) + std::pow(y - PLANET_SIZE / 2.0, 2));

            // Check if the point is within the circle
            if (distance <= radius) {
                // Generate Perlin noise value for this point
                double value = perlinModule.GetValue(x / 5.0, y / 5.0, 0.0); // Adjust the scale here

                // Map noise value to range [0, 1]
                value = (value + 1.0) / 2.0;

                // Store the noise value in the height map
                heightMap[x][y] = value;
            } else {
                // If the point is outside the circle, set height to zero
                heightMap[x][y] = 0.0;
            }
        }
    }
}

// Function to generate a random RGB color
SDL_Color generateRandomColor() {
    std::srand(std::time(nullptr));
    return {static_cast<Uint8>(rand() % 225), static_cast<Uint8>(rand() % 175), static_cast<Uint8>(rand() % 200), 255};
}

int main() {
    // Initialize SDL
    SDL_Init(SDL_INIT_VIDEO);

    // Create an SDL window and renderer
    SDL_Window* window = SDL_CreateWindow("Height Map Display", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, PLANET_SIZE * WINDOW_SCALE, PLANET_SIZE * WINDOW_SCALE, SDL_WINDOW_SHOWN);
    SDL_Renderer* renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);

    // Create a surface to hold the height map
    SDL_Surface* surface = SDL_CreateRGBSurface(0, PLANET_SIZE, PLANET_SIZE, 32, 0, 0, 0, 0);

    // Lock the surface to access its pixels
    SDL_LockSurface(surface);

    // Generate the height map
    double heightMap[PLANET_SIZE][PLANET_SIZE];
    generateHeightMap(heightMap);

    // Generate a random RGB color
    SDL_Color color = generateRandomColor();

    // Populate the surface with height map data
    for (int x = 0; x < PLANET_SIZE; ++x) {
        for (int y = 0; y < PLANET_SIZE; ++y) {
            // Calculate the pixel index
            int index = y * surface->pitch + x * sizeof(Uint32);

            // Convert height map value to grayscale color
            Uint8 gray = static_cast<Uint8>(heightMap[x][y] * 255);

            // Multiply grayscale value with RGB components
            Uint8 r = color.r * gray / 255;
            Uint8 g = color.g * gray / 255;
            Uint8 b = color.b * gray / 255;

            // Set pixel color
            *((Uint32*)((Uint8*)surface->pixels + index)) = SDL_MapRGB(surface->format, r, g, b);
        }
    }

    // Unlock the surface
    SDL_UnlockSurface(surface);

    // Create a texture from the surface
    SDL_Texture* texture = SDL_CreateTextureFromSurface(renderer, surface);

    // Clear the renderer
    SDL_RenderClear(renderer);

    // Render the texture to the screen
    SDL_Rect destRect = {0, 0, PLANET_SIZE * WINDOW_SCALE, PLANET_SIZE * WINDOW_SCALE};
    SDL_RenderCopy(renderer, texture, NULL, &destRect);

    // Update the screen
    SDL_RenderPresent(renderer);

    // Main loop
    bool quit = false;
    SDL_Event e;
    while (!quit) {
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_QUIT) {
                quit = true;
            }
        }
    }

    // Cleanup
    SDL_DestroyTexture(texture);
    SDL_FreeSurface(surface);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}