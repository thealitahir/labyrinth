import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import Labyrinth from '../models/labyrinth.model'
import { LabyrinthDto } from '../dto/labyrinth.request.dto';


const getLabyrinths = async (req: any, res: Response) => {
    try {
        const data = await Labyrinth.find({
            userId: req.user.userId
        })
        return res.status(200).json({
            status: true,
            message: "Labyrinths Get successfully.",
            data
        });
    } catch (error: any) {
        res.status(422).json({ status: false, error: error.message });
    }
};

const getLabyrinthById = async (req: any, res: Response) => {
    try {
        const data = await Labyrinth.findOne({
            userId: req.user.userId,
            _id:req.params.id
        })
        return res.status(200).json({
            status: true,
            message: "Labyrinth Get successfully.",
            data
        });
    } catch (error: any) {
        res.status(422).json({ status: false, error: error.message });
    }
};

const createLabyrinth = async (req: any, res: Response) => {
    try {
        const data = plainToClass(LabyrinthDto, req.body);
        const errors = await validate(data);

        if (errors.length > 0) {
            return res.status(422).json({ status: false, error: errors });
        }

        const { name } = req.body;
        const newLabyrinth = new Labyrinth({
            userId: req.user.userId,
            name,
            structure: [],
        });

        await newLabyrinth.save();
        return res.status(200).json({
            status: true,
            message: "Create a new labyrinth successfully.",
            data: newLabyrinth._id
        });
    } catch (error: any) {
        res.status(422).json({ status: false, error: error.message });
    }
};

const updatedLabyrinth = async (req, res) => {
    try {
        const { id, x, y, type } = req.params;

        if (x < 0 || y < 0) {
            return res.status(400).send('X and Y coordinates should be greater than or equal to 0.');
        }

        const found = await Labyrinth.findById(id);
        if (!found) {
            return res.status(404).send('Labyrinth not found.');
        }

        const updatedStructure = { ...found.structure };

        if (!updatedStructure[x]) {
            updatedStructure[x] = [];
        }
        updatedStructure[x][y] = type;
        found.structure = updatedStructure;

        const updatedResponse = await Labyrinth.findOneAndUpdate({ _id: id }, { $set: { structure: updatedStructure } }, { new: true });

        return res.status(200).json({
            status: true,
            message: 'Updated labyrinth successfully.',
            data: updatedResponse,
        });
    } catch (error) {
        res.status(422).json({ status: false, error: error.message });
    }
};


const updatedLabyrinthStartCords = async (req, res) => {
    try {
        const { id, x, y } = req.params;

        const found = await Labyrinth.findById(id)
        if (!found) {
            return res.status(403).send('Failed to find the labyrinth.');
        }
        const updatedResponse = await Labyrinth.findOneAndUpdate({ _id: id }, {
            $set: {
                start: {
                    x,
                    y
                }
            }
        }, { new: true });
        return res.status(200).json({
            status: true,
            message: "Starting point set successfully.",
            data: updatedResponse
        });
    } catch (error) {
        res.status(422).json({ status: false, error: error.message });
    }
};

const updatedLabyrinthEndCords = async (req, res) => {
    try {
        const { id, x, y } = req.params;

        const found = await Labyrinth.findById(id)
        if (!found) {
            return res.status(403).send('Failed to find the labyrinth.');
        }
        const updatedResponse = await Labyrinth.findOneAndUpdate({ _id: id }, {
            $set: {
                end: {
                    x: parseInt(x),
                    y: parseInt(y)
                }
            }
        }, { new: true });
        return res.status(200).json({
            status: true,
            message: "Ending point set successfully.",
            data: updatedResponse
        });
    } catch (error) {
        res.status(422).json({ status: false, error: error.message });
    }
};

const getLabyrinthSolution = async (req, res) => {
    try {
        const { id } = req.params;
        const found = await Labyrinth.findById(id)
        const solution = calculateSolution(found)
        return res.status(200).json({
            status: true,
            message: "Labyrinth solution got successfully.",
            data: solution
        });
    } catch (error) {
        res.status(422).json({ status: false, error: error.message });
    }
}

function calculateSolution(labyrinth) {
    const visited = new Set();
    const start = labyrinth.start;
    const end = labyrinth.end;

    function dfs(x, y, path = []) {
        if (x === end.x && y === end.y) {
            return path;
        }

        if (
            x < 0 || y < 0 ||
            x >= Object.keys(labyrinth.structure).length ||
            !labyrinth.structure[x] ||
            y >= (labyrinth.structure[x].length || 0) ||
            visited.has(`${x}-${y}`)
        ) {
            return null; // Dead end or already visited
        }

        visited.add(`${x}-${y}`);

        // Directions to explore
        const directions = ['up', 'down', 'left', 'right'];

        let shortestPath = null;

        for (const dir of directions) {
            let newX = x, newY = y;
            if (dir === 'up') {
                newX--;
            } else if (dir === 'down') {
                newX++;
            } else if (dir === 'left') {
                newY--;
            } else {
                newY++;
            }

            if (
                newX >= 0 && newY >= 0 &&
                newX < Object.keys(labyrinth.structure).length &&
                labyrinth.structure[newX] &&
                newY < labyrinth.structure[newX].length &&
                labyrinth.structure[newX][newY] !== 'filled' &&
                !visited.has(`${newX}-${newY}`)
            ) {
                const result = dfs(newX, newY, [...path, dir]);
                if (result !== null) {
                    if (!shortestPath || result.length < shortestPath.length) {
                        shortestPath = result; // Update with a shorter path
                    }
                }
            }
        }

        visited.delete(`${x}-${y}`);

        return shortestPath;
    }

    const solution = dfs(start.x, start.y);

    return solution;
}


export { getLabyrinths, getLabyrinthById, createLabyrinth, updatedLabyrinth, updatedLabyrinthStartCords, updatedLabyrinthEndCords, getLabyrinthSolution }
