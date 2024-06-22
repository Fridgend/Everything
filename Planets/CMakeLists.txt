cmake_minimum_required(VERSION 3.10)
project(Planets)

# Set C++ standard
set(CMAKE_CXX_STANDARD 11)

# Find SDL2 and SDL2_image
find_package(SDL2 REQUIRED)
find_package(SDL2_image REQUIRED)
find_package(SDL2_mixer REQUIRED)
find_package(OpenGL REQUIRED)

# Include directories
include_directories(${SDL2_INCLUDE_DIRS} ${SDL2_IMAGE_INCLUDE_DIRS} ${SDL2_MIXER_INCLUDE_DIRS} include)

# Source files
file(GLOB SOURCES "current/*.cpp")

# Add executable
add_executable(Planets ${SOURCES})

# Link SDL2 libraries
target_link_libraries(Planets SDL2::SDL2 SDL2_image::SDL2_image SDL2_mixer::SDL2_mixer ${OPENGL_LIBRARIES})

# Post-build steps to copy assets
add_custom_command(TARGET Planets POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${CMAKE_SOURCE_DIR}/assets $<TARGET_FILE_DIR:Planets>/assets)