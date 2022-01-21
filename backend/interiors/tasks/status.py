# Copyright (c) 2022, Piotr Paturej, Miłosz Kasak, Kamil Szydłowski, Jakub Polak
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

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
