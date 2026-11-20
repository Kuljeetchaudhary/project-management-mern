import { Apiresponse } from "../Utills/api-responses.js";
import { asyncHandler } from "../Utills/asyncHandler.js";

/***
 * WE CAN WRITE OUR FUNCTION LIKE THIS FIRST THEN WE HAVE SECOND OPTION TO AVOID TO MUCH TRY  CATCH
 * 
 *  const healthCheck = (req, res) => {
  try {
    res
      .status(200)
      .json(new Apiresponse(200, { messsge: "Server  health is good" }));
  } catch (error) {
    throw new Error(error.messsge);
  }
};
 */

const healthCheck = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new Apiresponse(200, { message: "Server us Running well !" }));
});

export default { healthCheck };
