#include <SDL2/SDL.h>
#include <GLES3/gl3.h>
#include <iostream>
#include <vector>
#include <cmath>
#include <time.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>

#include "FastNoiseLite.h"

const int SCREEN_WIDTH = 800;
const int SCREEN_HEIGHT = 600;

int seed = 0;

SDL_Window* window = nullptr;
SDL_GLContext glContext;

std::vector<float> generateRandomColor() {
    return {std::max(100.0f, (float)(rand() % 200)), std::max(100.0f, (float)(rand() % 200)), std::max(100.0f, (float)(rand() % 200)), 255.0f};
}

std::vector<float> baseColor;
std::vector<float> lowerColor;
std::vector<float> lowestColor;

float PerlinValue(float x, float y, float z) {
    FastNoiseLite noise;
    noise.SetNoiseType(FastNoiseLite::NoiseType_Perlin);
    noise.SetSeed(seed);
    noise.SetFrequency(3.0f);

    return (noise.GetNoise(x, y, z) + 1.0f) / 2.0f;
}

bool init() {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        std::cerr << "SDL could not initialize! SDL_Error: " << SDL_GetError() << std::endl;
        return false;
    }

    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 1);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);

    window = SDL_CreateWindow("SDL OpenGL", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
                              SCREEN_WIDTH, SCREEN_HEIGHT, SDL_WINDOW_OPENGL | SDL_WINDOW_SHOWN);
    if (!window) {
        std::cerr << "Window could not be created! SDL_Error: " << SDL_GetError() << std::endl;
        return false;
    }

    glContext = SDL_GL_CreateContext(window);
    if (!glContext) {
        std::cerr << "OpenGL context could not be created! SDL_Error: " << SDL_GetError() << std::endl;
        return false;
    }

    if (SDL_GL_SetSwapInterval(1) < 0) {
        std::cerr << "Warning: Unable to set VSync! SDL_Error: " << SDL_GetError() << std::endl;
    }

    glEnable(GL_DEPTH_TEST);

    return true;
}

void close() {
    SDL_DestroyWindow(window);
    window = nullptr;

    SDL_Quit();
}

struct Vertex {
    float x, y, z, r, g, b, perlin;

    Vertex(float x, float y, float z, float perlin) : x(x), y(y), z(z), perlin(perlin) {
        if (perlin > 0.6) {
            r = baseColor[0] / 255.0f;
            g = baseColor[1] / 255.0f;
            b = baseColor[2] / 255.0f;
        } else if (perlin > 0.5) {
            r = lowerColor[0] / 255.0f;
            g = lowerColor[1] / 255.0f;
            b = lowerColor[2] / 255.0f;
        } else {
            r = lowestColor[0] / 255.0f;
            g = lowestColor[1] / 255.0f;
            b = lowestColor[2] / 255.0f;
        }
    }

    Vertex normalize() {
        float length = sqrt(x*x + y*y + z*z);
        return Vertex(x / length, y / length, z / length, perlin);
    }

    Vertex midpoint(const Vertex& other) {
        return Vertex((x + other.x) / 2.0f, (y + other.y) / 2.0f, (z + other.z) / 2.0f, 
        PerlinValue((x + other.x) / 2.0f, (y + other.y) / 2.0f, (z + other.z) / 2.0f)).normalize();
    }
};

struct Triangle {
    int v1, v2, v3;

    Triangle(int v1, int v2, int v3) : v1(v1), v2(v2), v3(v3) {}
};

std::vector<Vertex> createIcosahedronVertices() {
    float t = (1.0 + sqrt(5.0)) / 2.0;

    std::vector<Vertex> vertices = {
        Vertex(-1,  t,  0, PerlinValue(-1,  t,  0)).normalize(),
        Vertex( 1,  t,  0, PerlinValue(1,  t,  0)).normalize(),
        Vertex(-1, -t,  0, PerlinValue(-1,  -t,  0)).normalize(),
        Vertex( 1, -t,  0, PerlinValue(1,  -t,  0)).normalize(),
        Vertex( 0, -1,  t, PerlinValue(0,  -1,  t)).normalize(),
        Vertex( 0,  1,  t, PerlinValue(0,  1,  t)).normalize(),
        Vertex( 0, -1, -t, PerlinValue(0,  -1,  -t)).normalize(),
        Vertex( 0,  1, -t, PerlinValue(0,  1,  -t)).normalize(),
        Vertex( t,  0, -1, PerlinValue(t,  0,  -1)).normalize(),
        Vertex( t,  0,  1, PerlinValue(t,  0,  1)).normalize(),
        Vertex(-t,  0, -1, PerlinValue(-t,  0,  -1)).normalize(),
        Vertex(-t,  0,  1, PerlinValue(-t,  0,  1)).normalize()
    };

    return vertices;
}

std::vector<Triangle> createIcosahedronTriangles() {
    std::vector<Triangle> triangles = {
        {0, 11, 5}, {0, 5, 1}, {0, 1, 7}, {0, 7, 10}, {0, 10, 11},
        {1, 5, 9}, {5, 11, 4}, {11, 10, 2}, {10, 7, 6}, {7, 1, 8},
        {3, 9, 4}, {3, 4, 2}, {3, 2, 6}, {3, 6, 8}, {3, 8, 9},
        {4, 9, 5}, {2, 4, 11}, {6, 2, 10}, {8, 6, 7}, {9, 8, 1}
    };

    return triangles;
}

void subdivide(std::vector<Vertex>& vertices, std::vector<Triangle>& triangles, int level) {
    for (int i = 0; i < level; ++i) {
        std::vector<Triangle> newTriangles;
        for (const auto& tri : triangles) {
            Vertex v1 = vertices[tri.v1];
            Vertex v2 = vertices[tri.v2];
            Vertex v3 = vertices[tri.v3];

            Vertex m1 = v1.midpoint(v2);
            Vertex m2 = v2.midpoint(v3);
            Vertex m3 = v3.midpoint(v1);

            int m1Index = vertices.size();
            vertices.push_back(m1);
            int m2Index = vertices.size();
            vertices.push_back(m2);
            int m3Index = vertices.size();
            vertices.push_back(m3);

            newTriangles.push_back(Triangle(tri.v1, m1Index, m3Index));
            newTriangles.push_back(Triangle(tri.v2, m2Index, m1Index));
            newTriangles.push_back(Triangle(tri.v3, m3Index, m2Index));
            newTriangles.push_back(Triangle(m1Index, m2Index, m3Index));
        }
        triangles = newTriangles;
    }
}

const char* vertexShaderSource = R"(
#version 300 es
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 perlinColorValue;

out vec3 colorValue;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main() {
    gl_Position = projection * view * model * vec4(aPos, 1.0);
    colorValue = perlinColorValue;
}
)";

const char* fragmentShaderSource = R"(
#version 300 es
precision mediump float;

out vec4 FragColor;
in vec3 colorValue;

void main() {
    FragColor = vec4(colorValue, 1.0);
}
)";



GLuint compileShader(GLenum type, const char* source) {
    GLuint shader = glCreateShader(type);
    glShaderSource(shader, 1, &source, nullptr);
    glCompileShader(shader);

    int success;
    glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
    if (!success) {
        char infoLog[512];
        glGetShaderInfoLog(shader, 512, nullptr, infoLog);
        std::cerr << "ERROR::SHADER::COMPILATION_FAILED\n" << infoLog << std::endl;
    }

    return shader;
}

GLuint createShaderProgram() {
    GLuint vertexShader = compileShader(GL_VERTEX_SHADER, vertexShaderSource);
    GLuint fragmentShader = compileShader(GL_FRAGMENT_SHADER, fragmentShaderSource);

    GLuint shaderProgram = glCreateProgram();
    glAttachShader(shaderProgram, vertexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);

    int success;
    glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
    if (!success) {
        char infoLog[512];
        glGetProgramInfoLog(shaderProgram, 512, nullptr, infoLog);
        std::cerr << "ERROR::PROGRAM::LINKING_FAILED\n" << infoLog << std::endl;
    }

    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);

    return shaderProgram;
}

GLuint VAO, VBO, EBO;
void setupSphereBuffers(const std::vector<Vertex>& vertices, const std::vector<Triangle>& triangles) {
    std::vector<float> vertexData;
    for (const auto& v : vertices) {
        vertexData.push_back(v.x);
        vertexData.push_back(v.y);
        vertexData.push_back(v.z);
        vertexData.push_back(v.r);
        vertexData.push_back(v.g);
        vertexData.push_back(v.b);
    }

    std::vector<unsigned int> indices;
    for (const auto& tri : triangles) {
        indices.push_back(tri.v1);
        indices.push_back(tri.v2);
        indices.push_back(tri.v3);
    }

    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);

    glBindVertexArray(VAO);

    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, vertexData.size() * sizeof(float), vertexData.data(), GL_STATIC_DRAW);

    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, indices.size() * sizeof(unsigned int), indices.data(), GL_STATIC_DRAW);

    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);

    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)(3 * sizeof(float)));
    glEnableVertexAttribArray(1);

    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindVertexArray(0);
}

void renderSphere(GLuint shaderProgram, const std::vector<Triangle>& triangles) {
    glUseProgram(shaderProgram);

    glm::mat4 model = glm::mat4(1.0f);
    glm::mat4 view = glm::lookAt(glm::vec3(0.0f, 0.0f, 3.0f), glm::vec3(0.0f, 0.0f, 0.0f), glm::vec3(0.0f, 1.0f, 0.0f));
    glm::mat4 projection = glm::perspective(glm::radians(45.0f), (float)SCREEN_WIDTH / (float)SCREEN_HEIGHT, 0.1f, 100.0f);

    GLuint modelLoc = glGetUniformLocation(shaderProgram, "model");
    GLuint viewLoc = glGetUniformLocation(shaderProgram, "view");
    GLuint projLoc = glGetUniformLocation(shaderProgram, "projection");

    glUniformMatrix4fv(modelLoc, 1, GL_FALSE, &model[0][0]);
    glUniformMatrix4fv(viewLoc, 1, GL_FALSE, &view[0][0]);
    glUniformMatrix4fv(projLoc, 1, GL_FALSE, &projection[0][0]);

    glBindVertexArray(VAO);
    glDrawElements(GL_TRIANGLES, triangles.size() * 3, GL_UNSIGNED_INT, 0);
    glBindVertexArray(0);
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

void rotateVertices(std::vector<Vertex>& vertices, float angleX, float angleY, float angleZ) {
    for (Vertex& vertex : vertices) {
        float& x = vertex.x;
        float& y = vertex.y;
        float& z = vertex.z;

        rotateX(y, z, angleX);
        rotateY(x, z, angleY);
        rotateZ(x, y, angleZ);
    }
}

int main(int argc, char* args[]) {
    srand(time(0));
    seed = rand();

    baseColor = generateRandomColor();
    lowerColor = {std::max(1.0f, baseColor[0] - 20.0f), std::max(1.0f, baseColor[1] - 20.0f), std::max(1.0f, baseColor[2] - 20.0f), 255.0f};
    lowestColor = {std::max(1.0f, baseColor[0] - 50.0f), std::max(1.0f, baseColor[1] - 50.0f), std::max(1.0f, baseColor[2] - 50.0f), 255.0f};


    if (!init()) {
        std::cerr << "Failed to initialize!" << std::endl;
        return -1;
    }

    std::vector<Vertex> vertices = createIcosahedronVertices();
    std::vector<Triangle> triangles = createIcosahedronTriangles();

    int subdivisionLevel = 5; // Adjust this for higher/lower detail
    subdivide(vertices, triangles, subdivisionLevel);

    GLuint shaderProgram = createShaderProgram();

    bool quit = false;
    SDL_Event e;
    while (!quit) {
        while (SDL_PollEvent(&e) != 0) {
            if (e.type == SDL_QUIT) {
                quit = true;
            }
        }

        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        setupSphereBuffers(vertices, triangles);
        renderSphere(shaderProgram, triangles);

        rotateVertices(vertices, 0.005f, 0.001f, 0.001f);

        SDL_GL_SwapWindow(window);
    }

    close();

    return 0;
}
