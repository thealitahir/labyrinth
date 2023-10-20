export const paginationMiddleware = (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 5; // Default to 5 records per page
    const skip = (page - 1) * limit;
    req.pagination = {
      skip,
      limit,
    };
  
    next();
  };
  