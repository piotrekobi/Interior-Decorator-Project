import time

class TaskStatuses:
    """
    Contains information about tasks' statuses
    """
    def __init__(self):
        self._task_statuses = {}
    
    def createNewTaskStatus(self):
        """
        Adds a new task status to the collection
        """
        taskStatusId = time.time()
        self._task_statuses[taskStatusId] = 0
        return taskStatusId
    
    def getProgress(self, id):
        """
        Returns information about the status of a a given task
        """
        return self._task_statuses[id]
    
    def setProgress(self, id, progress):
        """
        Sets information about the status of a a given task
        """
        self._task_statuses[id] = progress
    
    def removeTaskStatus(self, id):
        """
        Removes a given task status from the collection
        """
        try:
            del self._task_statuses[id]
        except KeyError:
            pass

taskStatuses = TaskStatuses()
