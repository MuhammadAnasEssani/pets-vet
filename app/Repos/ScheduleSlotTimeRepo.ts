import BaseRepo from 'App/Repos/BaseRepo'
import ScheduleSlotTime from "App/Models/ScheduleSlotTime";
import ScheduleSlot from "App/Models/ScheduleSlot";


class ScheduleSlotTimeRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(ScheduleSlotTime, relations, scopes)
    this.model = ScheduleSlotTime
  }



  async delete(id) {
    let row = await this.model.findOrFail(id)
    await row.delete()

    // Check if there are any remaining schedule slot times for this schedule slot
    const remainingSlotTimes = await this.model.query()
      .where('schedule_slot_id', row.scheduleSlotId)
      .first();

    // If no remaining schedule slot times, delete the schedule slot as well
    if (!remainingSlotTimes) {
      const scheduleSlot = await ScheduleSlot.findOrFail(row.scheduleSlotId);
      await scheduleSlot.delete();
    }
  }
}

export default new ScheduleSlotTimeRepo()
