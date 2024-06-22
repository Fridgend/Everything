# Planets
This project is kind of a mess, but cool (in my opinion). This is a program that I used to generate a rotating planet with different terrain and colors based on some seed.
When you run the code, a planet will appear with some colors and some terrain generated using Perlin noise.
What I find very interesting about this project is how you can see how it develops over time. At first, it was just a simple sphere, just a still image of a circular thing with some cool colors and terrain. Later, you see some cheap rotation was added, and then you see how that rotation was improved on. Now, in the most recent version, I have started using OpenGL (more on that in OGLT) to try to optimize it since the previous versions were difficult to run.
In the `current` folder, you can find the most recent version of the generator.

This project was written entirely in C++ and some GLSL and CMake.
