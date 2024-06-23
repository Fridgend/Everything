# Logic Gates
This project was heavily inspired by a video made by Sebastian Lague (the programming legend) called "Visualizing Data with 7-Segment Displays" (https://www.youtube.com/watch?v=hEDQpqhY2MA&t=1507s)
In the video he quickly explains how he designed an algorithm to, using only logic gates, turn a few on-and-off signals to some other on-and-off signals using only some logic gates. It sounds pretty easy but got pretty difficult pretty fast.
I also wanted to try to solve this problem, and I did so using an A* (A-star) pathfinding algorithm to try to find the fastest way to the solution. I soon realized quite a few issues with this approach and so I've been wanting to rewrite it so that it uses a genetic algorithm instead (which also happens to be what he used in the video).

## Challenges:
- The main issue with the current version of this project is how slow and inefficient it is. There's a problem where it will explore certain solutions that look better for a very long time before realizing it is quite bad. Even if the solution is just one singular gate, it might try to explore a lot of other solutions before that one and find that the solutions it has explored look promising, so it continues exploring them, pushing the actual solution further and further down.

## Improvements for the future:
- I'd like to see if I could optimize the current code any more, and try to fix the issue stated previously.
- I would also like to try a few different approaches. First I'd like to try a genetic algorithm to see if it would be a better fit for this problem.

## What I learned:
- Working on this project taught me a lot about how a computer and logic gates work.
- It deepend my knowledge of the A* (A-star) pathfinding algorithm and how you can implement it in a scenario like this one.
- I think this was my first ever C++ project, and I think it’s safe to say that I gained most of my knowledge of C++ from here.

Anyway, it was a while since I last touched this project and I don't really dare to touch anything else as of right now. It works for easy problems, but takes an unreasonable amount of time for some slightly more difficult problems.
I used CLion to write it, hence the .idea folder.

### Written in...
This project was written entirely in C++ (and some CMake)
