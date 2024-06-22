#include <iostream>
#include <vector>
#include <cmath>
#include <SDL2/SDL.h>
#include <ctime>

#include "FastNoiseLite.h"

float perlin(float x, float y, float z, int seed) {
    static noise::module::Perlin perlinModule;

    perlinModule.SetSeed(seed);
    perlinModule.SetFrequency(0.7);

    double value = perlinModule.GetValue( x, y, z );

    value = (value + 1.0) / 2.0;
    return value;
}

std::vector<std::vector<float>> generateSphere(int samples, float radius, int seed) {
    std::vector<std::vector<float>> points;
    float phi = M_PI * (sqrt(5.0) - 1.0); // golden angle in radians

    for (int i = 0; i < samples; ++i) {
        float y = 1.0f - (i / static_cast<float>(samples - 1)) * 2.0f; // y goes from 1 to -1
        float r = sqrt(1.0f - y * y); // radius at y

        float theta = phi * i; // golden angle increment

        float x = cos(theta) * r;
        float z = sin(theta) * r;

        // Scale the coordinates by the radius
        x *= radius;
        y *= radius;
        z *= radius;

        points.push_back({x, y, z, perlin(x, y, z, seed)});
    }

    return points;
}

void rotateX(float& y, float& z, float angle) {
    float newY = y * cos(angle) - z * sin(angle);
    float newZ = y * sin(angle) + z * cos(angle);
    y = newY;
    z = newZ;
}

void rotateY(float& x, float& z, float angle) {
    float newX = x * cos(angle) + z * sin(angle);
    float newZ = -x * sin(angle) + z * cos(angle);
    x = newX;
    z = newZ;
}


void rotateZ(float& x, float& y, float angle) {
    float newX = x * cos(angle) - y * sin(angle);
    float newY = x * sin(angle) + y * cos(angle);
    x = newX;
    y = newY;
}

void rotateVertices(std::vector<std::vector<float>>& vertices, float angleX, float angleY, float angleZ) {
    for (std::vector<float>& vertex : vertices) {
        float& x = vertex[0];
        float& y = vertex[1];
        float& z = vertex[2];

        rotateX(y, z, angleX);
        rotateY(x, z, angleY);
        rotateZ(x, y, angleZ);
    }
}

std::vector<std::vector<float>> extractFrontFacingVertices(const std::vector<std::vector<float>>& vertices) {
    std::vector<std::vector<float>> frontFacingVertices;

    for (const auto& vertex : vertices) {
        if (vertex[2] >= 0) { // Check if z-coordinate is non-negative
            frontFacingVertices.push_back(vertex);
        }
    }

    return frontFacingVertices;
}

std::vector<std::vector<float>> projectVertices(const std::vector<std::vector<float>>& vertices, int screenWidth, int screenHeight) {
    std::vector<std::vector<float>> projectedVertices;

    // Assuming focal length and camera position
    float focalLength = 2000.0f;
    float cameraX = screenWidth / 2.0f;
    float cameraY = screenHeight / 2.0f;

    for (const auto& vertex : vertices) {
        float x = vertex[0] * 20;
        float y = vertex[1] * 20;
        float z = vertex[2] * 20;

        float projectedX = (focalLength * x) / (z + focalLength) + cameraX;
        float projectedY = (focalLength * y) / (z + focalLength) + cameraY;

        // Clip vertices outside the screen
        if (projectedX >= 0 && projectedX < screenWidth && projectedY >= 0 && projectedY < screenHeight) {
            projectedVertices.push_back({projectedX, projectedY, vertex[3]});
        }
    }

    return projectedVertices;
}

bool initSDL(SDL_Window*& window, SDL_Renderer*& renderer, int screenWidth, int screenHeight) {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "SDL could not initialize! SDL Error: %s\n", SDL_GetError());
        return false;
    }

    window = SDL_CreateWindow("Pixel Planet", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, screenWidth, screenHeight, SDL_WINDOW_SHOWN);
    if (window == nullptr) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "Window could not be created! SDL Error: %s\n", SDL_GetError());
        return false;
    }

    renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
    if (renderer == nullptr) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "Renderer could not be created! SDL Error: %s\n", SDL_GetError());
        return false;
    }

    SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
    SDL_RenderClear(renderer);

    return true;
}

SDL_Color generateRandomColor() {
    return {static_cast<Uint8>(std::max(100, rand() % 200)), static_cast<Uint8>(std::max(100, rand() % 200)), static_cast<Uint8>(std::max(100, rand() % 200)), 255};
}

SDL_Texture* drawVerticesToTexture(SDL_Renderer* renderer, const std::vector<std::vector<float>>& vertices, int screenWidth, int screenHeight, int pixel_dims, bool color) {
    static SDL_Color baseColor = generateRandomColor();
    static SDL_Color lowerColor{static_cast<Uint8>(std::max(1, baseColor.r - 20)), static_cast<Uint8>(std::max(1, baseColor.g - 20)), static_cast<Uint8>(std::max(1, baseColor.b - 20)), 255};
    static SDL_Color lowestColor{static_cast<Uint8>(std::max(1, baseColor.r - 50)), static_cast<Uint8>(std::max(1, baseColor.g - 50)), static_cast<Uint8>(std::max(1, baseColor.b - 50)), 255};
    
    if (color) {
        baseColor = generateRandomColor();
        lowerColor = {static_cast<Uint8>(std::max(1, baseColor.r - 20)), static_cast<Uint8>(std::max(1, baseColor.g - 20)), static_cast<Uint8>(std::max(1, baseColor.b - 20)), 255};
        lowestColor = {static_cast<Uint8>(std::max(1, baseColor.r - 50)), static_cast<Uint8>(std::max(1, baseColor.g - 50)), static_cast<Uint8>(std::max(1, baseColor.b - 50)), 255};
    }

    SDL_Surface* surface = SDL_CreateRGBSurface(0, screenWidth, screenHeight, 32, 0, 0, 0, 0);
    SDL_LockSurface(surface);
    SDL_FillRect(surface, NULL, SDL_MapRGB(surface->format, 0, 0, 0));

    for (const auto& vertex : vertices) {
        int x = static_cast<int>(vertex[0]);
        int y = static_cast<int>(vertex[1]);

        int r, g, b;
        if (vertex[2] <= 76.0f / 255.0f) {
            r = lowestColor.r;
            g = lowestColor.g;
            b = lowestColor.b;
        } else if (vertex[2] <= 130.0f / 255.0f) {
            r = lowerColor.r;
            g = lowerColor.g;
            b = lowerColor.b;
        } else {
            r = baseColor.r;
            g = baseColor.g;
            b = baseColor.b;
        }

        Uint32 color = SDL_MapRGB(surface->format, r, g, b);

        if (x >= 0 && x < screenWidth && y >= 0 && y < screenHeight) {
            x -= pixel_dims / 2;
            y -= pixel_dims / 2;

            SDL_Rect pixel = {x, y, pixel_dims, pixel_dims};

            SDL_FillRect(surface, &pixel, color);
        }
    }

    SDL_Texture* texture = SDL_CreateTextureFromSurface(renderer, surface);
    SDL_FreeSurface(surface);

    return texture;
}

void render(SDL_Renderer* renderer, SDL_Texture* texture, SDL_Rect* destrect = NULL) {
    SDL_RenderClear(renderer);
    SDL_RenderCopy(renderer, texture, NULL, destrect);
    SDL_RenderPresent(renderer);
}

std::vector<std::vector<float>> dither(std::vector<std::vector<float>> vertices) {
    return vertices;
}

int main() {
    float scale = 1;

    int screenWidth = 600;
    int screenHeight = 600;
    int radius = 3;
    int samples = 20000;
    int pixel_size = 2;

    float rotationX = 0.0f;
    float rotationY = 0.0f;
    float rotationZ = 0.0f;

    std::srand(std::time(nullptr));

    std::vector<std::vector<float>> vertices = generateSphere(samples, radius, rand());

    SDL_Window* window = nullptr;
    SDL_Renderer* renderer = nullptr;

    if (!initSDL(window, renderer, screenWidth, screenHeight)) {
        return 1;
    }

    bool quit = false;
    bool use_dither = false;
    SDL_Event e;

    while (!quit) {
        std::cout << "RADIUS: " << radius << ", SAMPLES: " << samples << ", PIXEL: " << pixel_size << std::endl;

        bool color = false;
        const Uint8* state = SDL_GetKeyboardState(nullptr);

        if (state[SDL_SCANCODE_UP] && state[SDL_SCANCODE_X]) {
            rotationX += 0.0005f;
        } else if (state[SDL_SCANCODE_UP] && state[SDL_SCANCODE_Y]) {
            rotationY += 0.0005f;
        } else if (state[SDL_SCANCODE_UP] && state[SDL_SCANCODE_Z]) {
            rotationZ += 0.0005f;
        } else if (state[SDL_SCANCODE_DOWN] && state[SDL_SCANCODE_X]) {
            rotationX -= 0.0005f;
        } else if (state[SDL_SCANCODE_DOWN] && state[SDL_SCANCODE_Y]) {
            rotationY -= 0.0005f;
        } else if (state[SDL_SCANCODE_DOWN] && state[SDL_SCANCODE_Z]) {
            rotationZ -= 0.0005f;
        }

        while (SDL_PollEvent(&e) != 0) {
            if (e.type == SDL_QUIT) {
                quit = true;
            } else if (e.type == SDL_KEYDOWN) {
                if (e.key.keysym.sym == SDLK_PLUS) {
                    scale += 0.02f;
                } else if (e.key.keysym.sym == SDLK_MINUS) {
                    scale -= 0.02f;
                } else if (e.key.keysym.sym == SDLK_c) {
                    color = true;
                } else if (e.key.keysym.sym == SDLK_p) {
                    vertices = generateSphere(samples, radius, rand());
                } else if (e.key.keysym.sym == SDLK_a) {
                    color = true;
                    vertices = generateSphere(samples, radius, rand());
                } else if (e.key.keysym.sym == SDLK_d) {
                    use_dither = !use_dither;
                } else if (e.key.keysym.sym == SDLK_1) {
                    pixel_size += 1;
                } else if (e.key.keysym.sym == SDLK_2) {
                    pixel_size -= 1;
                } else if (e.key.keysym.sym == SDLK_3) {
                    samples += 1000;
                } else if (e.key.keysym.sym == SDLK_4) {
                    samples -= 1000;
                } else if (e.key.keysym.sym == SDLK_5) {
                    radius += 1;
                } else if (e.key.keysym.sym == SDLK_6) {
                    radius -= 1;
                }
            }
        }

        std::vector<std::vector<float>> frontFacingVertices = extractFrontFacingVertices(vertices);
        std::vector<std::vector<float>> projectedVertices = projectVertices(frontFacingVertices, screenWidth, screenHeight);
        SDL_Texture* texture;
        if (use_dither) {
            std::vector<std::vector<float>> ditheredVertices = dither(projectedVertices);
            texture = drawVerticesToTexture(renderer, ditheredVertices, screenWidth, screenHeight, pixel_size, color);
        } else {
            texture = drawVerticesToTexture(renderer, projectedVertices, screenWidth, screenHeight, pixel_size, color);
        }

        rotateVertices(vertices, rotationX, rotationY, rotationZ);

        SDL_Rect dest = {(int)((screenWidth - screenWidth * scale) / 2), (int)((screenHeight - screenHeight * scale) / 2), (int)(screenWidth * scale), (int)(screenHeight * scale)};
        render(renderer, texture, &dest);

        SDL_DestroyTexture(texture);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}