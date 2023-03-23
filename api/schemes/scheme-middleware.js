
const db = require('../../data/db-config')


/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  try {
    const existing = await db('schemes')
      .where('scheme_id', req.params.scheme_id) 
      //this ^^^ means check inside the scheme table of the database
      //and check if the scheme_id that is in the parameters of the request
      //are present
      .first()

      if(!existing) {
        next({ 
          status: 404, 
          message: `scheme with scheme_id ${req.params.scheme_id} not found`
        }) //<< if it doesnt exist send this back!
      } else {
        next()
      }
  } catch (err) {
    next(err)
  }
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body //<< destruturing the scheme_name out of the req.body
  if(
    scheme_name === undefined || //<< if it is undefined
    typeof scheme_name !== 'string' || //<< if the type is not a string
    !scheme_name.trim() //<< if we already know it is a string we can 
    //trim it and if it is falsey then it will not move on
    ) {
      next({ status: 400, message: "invalid scheme_name" })
  } else {
    next()
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body

  if(
    instructions === undefined || //<< if it is undefined
    typeof instructions !== 'string' || //<< if the type is not a string
    !instructions.trim() ||
    typeof step_number !== 'number' ||
    step_number < 1 //<< if we already know it is a string we can 
    //trim it and if it is falsey then it will not move on
    ) {
      const error = {status: 400, message: "invalid step"}
      next(error)
    } else {
      next()
    }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
