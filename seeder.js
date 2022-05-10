import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import projects from './data/projects.js'
import project from './models/projectmodel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    
    await project.deleteMany()
   



    const sampleprojects = projects.map((project) => {
      return { ...project}
    })

    await project.insertMany(sampleprojects)

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {

    await project.deleteMany()


    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}