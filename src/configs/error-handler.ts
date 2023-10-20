// 404 - not found error handler
import { Request, Response, NextFunction } from 'express';

const notFoundRoute = (req:Request, res:Response, next:NextFunction) => {
    res.status(404).json({ message: "Sorry! Your request page was not found." });
  };
  
  const errorHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
    if (res.headersSent) {
      return next("Something went wrong.");
    } else {
      if (err.message) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(500).json({ message: "There was an error." });
      }
    }
  };

  export {notFoundRoute,errorHandler}
  