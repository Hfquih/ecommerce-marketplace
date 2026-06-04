const cron = require('node-cron')
const Order = require('../connect/order')


const deleteSoftDeletedOrders = cron.schedule(
   '0 2 * * *', // every day at 2 AM
   async () => {
      try {

         const oneMonthAgo = new Date()

         oneMonthAgo.setMonth(
            oneMonthAgo.getMonth() - 1
         )

         const result = await Order.deleteMany({
            isDeleted: true,
            deletedAt: { $lte: oneMonthAgo }
         })

         console.log(
            `${result.deletedCount} orders permanently deleted`
         )

      } catch (error) {
         console.error(
            'Cron delete error:',
            error
         )
      }
   }
)

module.exports=deleteSoftDeletedOrders