const cron = require('node-cron')
const User = require('../connect/user')


const deleteSoftDeletedUsers = cron.schedule(
   '0 2 * * *', // every day at 2 AM
   async () => {
      try {

         const oneMonthAgo = new Date()

         oneMonthAgo.setMonth(
            oneMonthAgo.getMonth() - 1
         )

         const result = await User.deleteMany({
            isDeleted: true,
            deletedAt: { $lte: oneMonthAgo }
         })

         console.log(
            `${result.deletedCount} users permanently deleted`
         )

      } catch (error) {
         console.error(
            'Cron delete error:',
            error
         )
      }
   }
)

module.exports=deleteSoftDeletedUsers