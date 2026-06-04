const cron = require('node-cron')
const Product = require('../connect/products')


const deleteSoftDeletedProducts = cron.schedule(
   '0 2 * * *', // every day at 2 AM
   async () => {
      try {

         const oneMonthAgo = new Date()

         oneMonthAgo.setMonth(
            oneMonthAgo.getMonth() - 1
         )

         const result = await Product.deleteMany({
            isDeleted: true,
            deletedAt: { $lte: oneMonthAgo }
         })

         console.log(
            `${result.deletedCount} products permanently deleted`
         )

      } catch (error) {
         console.error(
            'Cron delete error:',
            error
         )
      }
   }
)

module.exports=deleteSoftDeletedProducts