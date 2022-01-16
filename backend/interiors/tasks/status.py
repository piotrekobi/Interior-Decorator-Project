import time

class TaskStatuses:
    def __init__(self):
        self._task_statuses = {}
    
    def createNewTaskStatus(self):
        taskStatusId = time.time()
        self._task_statuses[taskStatusId] = 0
        return taskStatusId
    
    def getProgress(self, id):
        return self._task_statuses[id]
    
    def setProgress(self, id, progress):
        self._task_statuses[id] = progress
    
    def removeTaskStatus(self, id):
        try:
            del self._task_statuses[id]
        except KeyError:
            pass

taskStatuses = TaskStatuses()
