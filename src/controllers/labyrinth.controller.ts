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
            structure:[],
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
  
      await found.save();
  
      return res.status(200).json({
        status: true,
        message: 'Updated labyrinth successfully.',
        data: found,
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
        found.start = {
            x,
            y
        }
        return res.status(200).json({
            status: true,
            message: "Starting point set successfully.",
            data: found
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
        found.end = {
            x: parseInt(x),
            y: parseInt(y)
        }
        console.log("found",found)
        return res.status(200).json({
            status: true,
            message: "Ending point set successfully.",
            data: found
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
    const directions = [];

    function dfs(x, y) {
        if (x < 0 || x >= labyrinth.structure.length || y < 0 || y >= labyrinth.structure[0].length) {
            return false; // Out of bounds
        }

        if (labyrinth.structure[x][y] === 'filled' || visited.has(`${x}-${y}`)) {
            return false; // Wall or already visited
        }

        visited.add(`${x}-${y}`);

        if (x === labyrinth.end.x && y === labyrinth.end.y) {
            return true; // Reached the end
        }

        if (dfs(x + 1, y)) {
            directions.push('right');
            return true;
        }
        if (dfs(x - 1, y)) {
            directions.push('left');
            return true;
        }
        if (dfs(x, y + 1)) {
            directions.push('down');
            return true;
        }
        if (dfs(x, y - 1)) {
            directions.push('up');
            return true;
        }

        return false; // No path found
    }

    dfs(labyrinth.start.x, labyrinth.start.y);

    return directions.reverse();
}

export { getLabyrinths, createLabyrinth, updatedLabyrinth, updatedLabyrinthStartCords, updatedLabyrinthEndCords, getLabyrinthSolution }
