# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.25

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/rpitrn/Desktop/OGLT

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/rpitrn/Desktop/OGLT/build

# Include any dependencies generated for this target.
include CMakeFiles/OGLT.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include CMakeFiles/OGLT.dir/compiler_depend.make

# Include the progress variables for this target.
include CMakeFiles/OGLT.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/OGLT.dir/flags.make

CMakeFiles/OGLT.dir/src/main.cpp.o: CMakeFiles/OGLT.dir/flags.make
CMakeFiles/OGLT.dir/src/main.cpp.o: /home/rpitrn/Desktop/OGLT/src/main.cpp
CMakeFiles/OGLT.dir/src/main.cpp.o: CMakeFiles/OGLT.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/rpitrn/Desktop/OGLT/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/OGLT.dir/src/main.cpp.o"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/OGLT.dir/src/main.cpp.o -MF CMakeFiles/OGLT.dir/src/main.cpp.o.d -o CMakeFiles/OGLT.dir/src/main.cpp.o -c /home/rpitrn/Desktop/OGLT/src/main.cpp

CMakeFiles/OGLT.dir/src/main.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/OGLT.dir/src/main.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/rpitrn/Desktop/OGLT/src/main.cpp > CMakeFiles/OGLT.dir/src/main.cpp.i

CMakeFiles/OGLT.dir/src/main.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/OGLT.dir/src/main.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/rpitrn/Desktop/OGLT/src/main.cpp -o CMakeFiles/OGLT.dir/src/main.cpp.s

CMakeFiles/OGLT.dir/src/shader.cpp.o: CMakeFiles/OGLT.dir/flags.make
CMakeFiles/OGLT.dir/src/shader.cpp.o: /home/rpitrn/Desktop/OGLT/src/shader.cpp
CMakeFiles/OGLT.dir/src/shader.cpp.o: CMakeFiles/OGLT.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/rpitrn/Desktop/OGLT/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object CMakeFiles/OGLT.dir/src/shader.cpp.o"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/OGLT.dir/src/shader.cpp.o -MF CMakeFiles/OGLT.dir/src/shader.cpp.o.d -o CMakeFiles/OGLT.dir/src/shader.cpp.o -c /home/rpitrn/Desktop/OGLT/src/shader.cpp

CMakeFiles/OGLT.dir/src/shader.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/OGLT.dir/src/shader.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/rpitrn/Desktop/OGLT/src/shader.cpp > CMakeFiles/OGLT.dir/src/shader.cpp.i

CMakeFiles/OGLT.dir/src/shader.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/OGLT.dir/src/shader.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/rpitrn/Desktop/OGLT/src/shader.cpp -o CMakeFiles/OGLT.dir/src/shader.cpp.s

# Object files for target OGLT
OGLT_OBJECTS = \
"CMakeFiles/OGLT.dir/src/main.cpp.o" \
"CMakeFiles/OGLT.dir/src/shader.cpp.o"

# External object files for target OGLT
OGLT_EXTERNAL_OBJECTS =

OGLT: CMakeFiles/OGLT.dir/src/main.cpp.o
OGLT: CMakeFiles/OGLT.dir/src/shader.cpp.o
OGLT: CMakeFiles/OGLT.dir/build.make
OGLT: /usr/lib/aarch64-linux-gnu/libSDL2.so
OGLT: /usr/lib/aarch64-linux-gnu/libSDL2_image.so
OGLT: /usr/lib/aarch64-linux-gnu/libSDL2_mixer.so
OGLT: /usr/lib/aarch64-linux-gnu/libGL.so
OGLT: /usr/lib/aarch64-linux-gnu/libGLU.so
OGLT: CMakeFiles/OGLT.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/home/rpitrn/Desktop/OGLT/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Linking CXX executable OGLT"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/OGLT.dir/link.txt --verbose=$(VERBOSE)
	/usr/bin/cmake -E copy_directory /home/rpitrn/Desktop/OGLT/assets /home/rpitrn/Desktop/OGLT/build/assets

# Rule to build all files generated by this target.
CMakeFiles/OGLT.dir/build: OGLT
.PHONY : CMakeFiles/OGLT.dir/build

CMakeFiles/OGLT.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/OGLT.dir/cmake_clean.cmake
.PHONY : CMakeFiles/OGLT.dir/clean

CMakeFiles/OGLT.dir/depend:
	cd /home/rpitrn/Desktop/OGLT/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/rpitrn/Desktop/OGLT /home/rpitrn/Desktop/OGLT /home/rpitrn/Desktop/OGLT/build /home/rpitrn/Desktop/OGLT/build /home/rpitrn/Desktop/OGLT/build/CMakeFiles/OGLT.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/OGLT.dir/depend

