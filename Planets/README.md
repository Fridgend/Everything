# Planets
This project is kind of a mess, but cool in my opinion. This is a program that I used to generate a rotating planet with different terrain and colors based on some seed.
When you run the code, a planet will appear with some colors and some terrain generated using Perlin noise.
What I find very interesting about this project is how you can see how it develops over time. At first, it was just a simple sphere, just a still image of a circular thing with some cool colors and terrain. Later, you see some cheap rotation was added, and then you see how that rotation was improved on. Now, in the most recent version, I have started using OpenGL (more on that in OGLT) to try to optimize it since the previous versions were difficult to run.
In the `current` folder, you can find the most recent version of the generator.

## Challenges:
- While making this project, I have consistently been limited by the poor processing power I had available (again, Raspberry Pi) and my inexperience in computer graphics (if a graphics programmer looked at my previous versions, there's a high chance that they'd puke). In the newest version however, `current/revised.cpp`, I am using OpenGL together with SDL2 to optimize this. I'm still working on that, but I think it has potential.

## Improvements for the future:
- There's still lots of optimization to do. I think what I'd do next performance-wise would be to rethink the way the sphere's vertices are generated seeing as the current way of doing it makes it really difficult to generate high-quality terrain.
- I would also like to work a little bit on how the planet actually looks, since it is currently looking really bad due to the lower amount of vertices. I've been thinking about maybe trying to smooth out the surface a bit more. I do think the previous future improvement could also be beneficial here.

## What I learned:
- I have developed a deeper understanding in noise modules and more about Perlin noise.
- I have been able to use what I learned from OGLT to use OpenGL to optimize the code.
- In the Planets project, I took a different approach than usual and instead slowly made new versions and improvements as I was developing it.

### Written in...
This project was written entirely in C++ and some GLSL and CMake.
