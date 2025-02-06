import { Request, Response } from "express";

import { BaseMapper } from "../mappers/baseMapper";

export const transformController = (req: Request, res: Response) => {
  try {
    // Create an instance of the BaseMapper
    const baseMapper = new BaseMapper();

    // Get input data from the request body
    const inputData = req.body;

    // Transform data using the BaseMapper
    const transformedData = baseMapper.transform(inputData);

    // Send transformed data as the response
    res.json(transformedData);
  } catch (error) {
    // Log any errors that occur during the transformation process
    console.error("Error during transformation:", error);

    // Send the error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};
