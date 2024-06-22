#include <iostream>
#include <cmath>
#include <SDL2/SDL.h>
#include <libnoise/noise.h>
#include <ctime>

// Define the width and height of your planet's height map
const int PLANET_SIZE = 128;
const int WINDOW_SCALE = 5; // Increase to make the planet bigger
const double ROTATION_SPEED = 50; // Adjust the rotation speed

void generateHeightMap(noise::module::Perlin perlinModule, double heightMap[PLANET_SIZE*2][PLANET_SIZE]) {
    perlinModule.SetFrequency(0.5);

    // Loop through each point in the height map using cylindrical coordinates
    for (int x = 0; x < PLANET_SIZE * 2; ++x) {
        for (int y = 0; y < PLANET_SIZE; ++y) {
            // Calculate cylindrical coordinates
            double phi = static_cast<double>(x) / PLANET_SIZE * M_PI;
            double theta = static_cast<double>(y) / PLANET_SIZE * 2 * M_PI;

            // Generate Perlin noise value at the cylindrical coordinates
            double value = perlinModule.GetValue(
                std::sin(phi) * std::cos(theta),
                std::sin(phi) * std::sin(theta),
                std::cos(theta)
            );

            value = (value + 1.0) / 2.0;
            heightMap[x][y] = value;
        }
    }
}

void generateClouds(noise::module::Perlin perlinModule, double heightMap[PLANET_SIZE*2][PLANET_SIZE]) {
    perlinModule.SetFrequency(0.4);

    // Loop through each point in the height map using cylindrical coordinates
    for (int x = 0; x < PLANET_SIZE * 2; ++x) {
        for (int y = 0; y < PLANET_SIZE; ++y) {
            // Calculate cylindrical coordinates
            double phi = static_cast<double>(x) / PLANET_SIZE * M_PI;
            double theta = static_cast<double>(y) / PLANET_SIZE * 2 * M_PI;

            // Generate Perlin noise value at the cylindrical coordinates
            double value = perlinModule.GetValue(
                std::sin(phi) * std::cos(theta),
                std::sin(phi) * std::sin(theta),
                std::cos(theta) * 80
            );

            value = (value + 1.0) / 2.0;
            heightMap[x][y] = value;
        }
    }
}


// Function to generate a random RGB color
SDL_Color generateRandomColor() {
    return {static_cast<Uint8>(std::max(100, rand() % 200)), static_cast<Uint8>(std::max(70, rand() % 200)), static_cast<Uint8>(std::max(100, rand() % 200)), 255};
}

void Shift(double heightMap[PLANET_SIZE*2][PLANET_SIZE]) {
    // Store the first column in a temporary array
    double first_column[PLANET_SIZE];
    for (int y = 0; y < PLANET_SIZE; ++y) {
        first_column[y] = heightMap[0][y];
    }

    // Shift all columns to the left by one
    for (int x = 0; x < 2 * PLANET_SIZE - 1; ++x) {
        for (int y = 0; y < PLANET_SIZE; ++y) {
            heightMap[x][y] = heightMap[x + 1][y];
        }
    }

    // Set the last column to the values stored in the temporary array
    for (int y = 0; y < PLANET_SIZE; ++y) {
        heightMap[2 * PLANET_SIZE - 1][y] = first_column[y];
    }
}

int main() {
    std::srand(std::time(nullptr));
    int seed = rand();
    
    // Initialize SDL
    SDL_Init(SDL_INIT_VIDEO);

    // Create an SDL window and renderer
    SDL_Window* window = SDL_CreateWindow("Height Map Display", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, PLANET_SIZE * WINDOW_SCALE, PLANET_SIZE * WINDOW_SCALE, SDL_WINDOW_SHOWN);
    SDL_Renderer* renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);

    // Create a surface to hold the height map
    SDL_Surface* surface = SDL_CreateRGBSurface(0, PLANET_SIZE, PLANET_SIZE, 32, 0, 0, 0, 0);

    // Generate a random RGB color
    SDL_Color baseColor = generateRandomColor();
    SDL_Color lowerColor{static_cast<Uint8>(std::max(1, baseColor.r - 20)), static_cast<Uint8>(std::max(1, baseColor.g - 20)), static_cast<Uint8>(std::max(1, baseColor.b - 20)), 255};
    SDL_Color lowestColor{static_cast<Uint8>(std::max(1, baseColor.r - 50)), static_cast<Uint8>(std::max(1, baseColor.g - 50)), static_cast<Uint8>(std::max(1, baseColor.b - 50)), 255};
    SDL_Color cloudColor{200, 200, 200};

    noise::module::Perlin perlinModule;
    perlinModule.SetSeed(seed);

    // Generate the height map for the current time
    double heightMap[PLANET_SIZE*2][PLANET_SIZE];
    generateHeightMap(perlinModule, heightMap);

    double cloudMap[PLANET_SIZE*2][PLANET_SIZE];
    generateClouds(perlinModule, cloudMap);

    // Main loop
    bool quit = false;
    SDL_Event e;

    double radius = PLANET_SIZE / 2.0f;
    int focal_length = 1000;

    while (!quit) {
        Shift(heightMap);
        Shift(cloudMap);

        // Lock the surface to access its pixels
        SDL_LockSurface(surface);

        // Populate the surface with height map data
        for (int x = 0; x < PLANET_SIZE; ++x) {
            for (int y = 0; y < PLANET_SIZE; ++y) {
                
                double distance = std::sqrt(std::pow(x - PLANET_SIZE / 2.0, 2) + std::pow(y - PLANET_SIZE / 2.0, 2));

                // Calculate 3D coordinates on the sphere
                double phi = static_cast<double>(x) / PLANET_SIZE * M_PI;
                double theta = static_cast<double>(y) / PLANET_SIZE * 2 * M_PI;

                double xCoord = radius * std::sin(phi) * std::cos(theta);
                double yCoord = radius * std::sin(phi) * std::sin(theta);
                double zCoord = radius * std::cos(phi);

                // Apply perspective projection
                double projectedX = xCoord * focal_length / (focal_length - zCoord);
                double projectedY = yCoord * focal_length / (focal_length - zCoord);

                // Convert projected 3D coordinates to screen coordinates
                int screenX = static_cast<int>(projectedX + PLANET_SIZE / 2);
                int screenY = static_cast<int>(projectedY + PLANET_SIZE / 2);

                Uint8 gray = static_cast<Uint8>(heightMap[x][y] * 255);
                Uint8 cloud = static_cast<Uint8>(cloudMap[x][y] * 255);
                
                // Calculate the pixel index
                int index = screenY * surface->pitch + screenX * sizeof(Uint32);

                if (distance > radius) {
                    *((Uint32*)((Uint8*)surface->pixels + index)) = SDL_MapRGB(surface->format, 0, 0, 0);
                } else if (cloud > 120) {
                    if (cloud > 130) {
                        *((Uint32*)((Uint8*)surface->pixels + index)) = SDL_MapRGB(surface->format, cloudColor.r, cloudColor.g, cloudColor.b);
                    } else {
                        *((Uint32*)((Uint8*)surface->pixels + index)) = SDL_MapRGB(surface->format, cloudColor.r-20, cloudColor.g-20, cloudColor.b-20);
                    }
                } else {
                    if (gray <= 76) {
                        *((Uint32*)((Uint8*)surface->pixels + index)) = SDL_MapRGB(surface->format, lowestColor.r, lowestColor.g, lowestColor.b);
                    } else if (gray <= 153) {
                        *((Uint32*)((Uint8*)surface->pixels + index)) = SDL_MapRGB(surface->format, lowerColor.r, lowerColor.g, lowerColor.b);
                    } else {
                        *((Uint32*)((Uint8*)surface->pixels + index)) = SDL_MapRGB(surface->format, baseColor.r, baseColor.g, baseColor.b);
                    }
                }
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
        SDL_RenderCopyEx(renderer, texture, NULL, &destRect, 220, NULL, SDL_FLIP_NONE); // Rotate the texture by rotationAngle

        // Update the screen
        SDL_RenderPresent(renderer);

        // Destroy the texture
        SDL_DestroyTexture(texture);

        // Handle events
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_QUIT) {
                quit = true;
            }
        }

        SDL_Delay(ROTATION_SPEED);
    }

    // Cleanup
    SDL_FreeSurface(surface);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}