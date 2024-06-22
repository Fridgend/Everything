# Logic Gates
This project was heavily inspired by a video made by Sebastian Lague (the programming legend) called "Visualizing Data with 7-Segment Displays" (https://www.youtube.com/watch?v=hEDQpqhY2MA&t=1507s)
In the video he quickly explains how he designed an algorithm to, using only logic gates, turn a few on-and-off signals to some other on-and-off signals using only some logic gates. It sounds pretty easy but got pretty difficult pretty fast.
I also wanted to try to solve this problem, and I did so using an A* (A-star) pathfinding algorithm to try to find the fastest way to the solution. I soon realized quite a few issues with this approach and so I've been wanting to rewrite it so that it uses a genetic algorithm instead (which also happens to be what he used in the video).

Anyway, it was a while since I last touched this project and I don't really dare to touch anything else as of right now. It works for easy problems, but takes an unreasonable amount of time for some slightly more difficult problems.
I used CLion to write it, hence the .idea folder.

This project was written entirely in C++ (and some CMake)