import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { UserDto } from 'src/dto/user.request.dto';

export async function validateUserDto(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    // Create an instance of TaskDto and populate it with the request body
    const userDto = new UserDto();
    Object.assign(userDto, req.body);

    // Validate the DTO
    const errors:any = await validate(userDto);
    if (errors.length > 0) {
      // If validation fails, return an error response
      const errorMessages = errors.map((error:any) => Object.values(error.constraints)).join(', ');
      return res.status(400).json({ error: errorMessages });
    }

    // If validation passes, store the validated DTO in the request for further processing
    req.userDto = userDto;
    next();
  } catch (error) {
    // Handle unexpected errors here
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
