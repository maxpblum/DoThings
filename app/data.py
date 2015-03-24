class TaskData(object):

  def __init__(self):
    self.data = {
      '1': ['some stuff']
    }

  def get_data(self, user_id):
    if user_id not in self.data:
      self.data[user_id] = []
    return self.data[user_id]

  def swap_two(user_id, task1_index, task2_index):
    data = self.data[user_id]
    if len(data) < max(task1_index, task2_index) + 1:
      raise
    tmp = data[task1_index]
    data[task1_index] = data[task2_index]
    data[task2_index] = tmp

  def add_task(task):
    get_data(user_id).append(task)

