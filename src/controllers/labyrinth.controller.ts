import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import Labyrinth from '../models/labyrinth.model'
import { LabyrinthDto } from '../dto/labyrinth.request.dto';

/**
   * Returns the user lybrinths Information.
   *
   * @remarks
   *
   * @returns logged in user lybrinths list
   *
*/
const fetchLabyrinths = async (req: any, res: Response) => {
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

/**
   * Returns the lybrinth information.
   *
   * @remarks
   *
   * @param id - The first input is id (string)
   * @returns lybrinth information
   *
*/
const fetchLabyrinthById = async (req: any, res: Response) => {
    try {
        const data = await Labyrinth.findOne({
            userId: req.user.userId,
            _id: req.params.id
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

/**
   * Returns the lybrinth id.
   *
   * @remarks
   *
   * @param name - The first input is name (string)
   * @returns newly created lybrinth id
   *
*/
const createNewLabyrinth = async (req: any, res: Response) => {
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

/**
   * Returns the lybrinths information.
   *
   * @remarks
   *
   * @param x - The first input is x
   * @param y - The second input is y 
   * @param type - The third input is type (string) 
   * @returns lybrinth updated information
   *
*/
const updateLabyrinth = async (req, res) => {
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

        const updatedLybrinth = await Labyrinth.findOneAndUpdate({ _id: id }, { $set: { structure: updatedStructure } }, { new: true });

        return res.status(200).json({
            status: true,
            message: 'Updated labyrinth successfully.',
            data: updatedLybrinth,
        });
    } catch (error) {
        res.status(422).json({ status: false, error: error.message });
    }
};

/**
   * Returns the lybrinths information.
   *
   * @remarks
   *
   * @param x - The first input is x
   * @param y - The second input is y
   * @returns lybrinth updated information with start cooridnates
   *
*/
const updateLabyrinthStartCoordinates = async (req, res) => {
    try {
        const { id, x, y } = req.params;

        const found = await Labyrinth.findById(id)
        if (!found) {
            return res.status(403).send('Failed to find the labyrinth.');
        }
        const updatedLybrinth = await Labyrinth.findOneAndUpdate({ _id: id }, {
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
            data: updatedLybrinth
        });
    } catch (error) {
        res.status(422).json({ status: false, error: error.message });
    }
};

/**
   * Returns the lybrinth Information.
   *
   * @remarks
   *
   * @param x - The first input is x
   * @param y - The second input is y
   * @returns lybrinth updated information with end coordinates
   *
*/
const updateLabyrinthEndCoordinates = async (req, res) => {
    try {
        const { id, x, y } = req.params;

        const found = await Labyrinth.findById(id)
        if (!found) {
            return res.status(403).send('Failed to find the labyrinth.');
        }
        const updatedLybrinth = await Labyrinth.findOneAndUpdate({ _id: id }, {
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
            data: updatedLybrinth
        });
    } catch (error) {
        res.status(422).json({ status: false, error: error.message });
    }
};

/**
   * Returns the solution for lybrinth.
   *
   * @remarks
   *
   * @param id - The first input is id (string)
   * @returns solution for current lybrinth
   *
*/
const calculateLabyrinthSolution = async (req, res) => {
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

/**
   * Helper Function  
   * Returns the Created User Information.
   *
   * @remarks
   *
   * @param lybrinth - The first input is lybrinth (object)
   * @returns calculation for current lybrinth
   *
*/
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


export { fetchLabyrinths, fetchLabyrinthById, createNewLabyrinth, updateLabyrinth, updateLabyrinthStartCoordinates, updateLabyrinthEndCoordinates, calculateLabyrinthSolution }
