const practicals = [
  {
    "id": "practical-2",
    "title": "Practical 2",
    "description": "Shell Scripting and File Handling",
    "language": "Bash",
    "code": "\n#!/bin/bash\n\n# Function\nshow_message()\n{\n    echo \"Welcome to Shell Scripting\"\n}\n\n# Display message\nshow_message\n\n# Decision making\necho \"Enter a number:\"\nread num\n\nif [ $num -gt 0 ]\nthen\n    echo \"Number is Positive\"\nelse\n    echo \"Number is Zero or Negative\"\nfi\n\n# Loop\necho \"Numbers from 1 to 5:\"\nfor i in {1..5}\ndo\n    echo $i\ndone\n\n# File handling\necho \"Enter filename:\"\nread file\n\ntouch $file\necho \"Hello Linux\" > $file\n\necho \"File created successfully\"\necho \"File content:\"\ncat $file\n\n# Check file\nif [ -f $file ]\nthen\n    echo \"File exists\"\nelse\n    echo \"File not found\"\nfi\n"
  },
  {
    "id": "practical-3",
    "title": "Practical 3",
    "description": "Process Creation and CPU Scheduling (FCFS, SJF, Round Robin)",
    "language": "C",
    "code": "#include <stdio.h>\n#include <unistd.h>\n#include <sys/wait.h>\n\nint main() {\n    int bt[] = {5, 3, 1}, n = 3, i, j, t = 2;\n    int wt[3] = {0}, tat[3], rem[3], temp;\n\n    // Process creation using system call\n    if (fork() == 0) {\n        printf(\"Child process created\\n\");\n        return 0;\n    }\n    wait(NULL);\n    printf(\"Parent process completed\\n\");\n\n    // FCFS Scheduling\n    printf(\"\\nFCFS:\\n\");\n    for (i = 0; i < n; i++) {\n        tat[i] = wt[i] + bt[i];\n        if (i < n - 1) wt[i + 1] = tat[i];\n        printf(\"P%d WT=%d TAT=%d\\n\", i + 1, wt[i], tat[i]);\n    }\n\n    // SJF Scheduling (sort burst times)\n    printf(\"\\nSJF:\\n\");\n    for (i = 0; i < n; i++)\n        for (j = i + 1; j < n; j++)\n            if (bt[i] > bt[j]) {\n                temp = bt[i]; bt[i] = bt[j]; bt[j] = temp;\n            }\n\n    wt[0] = 0;\n    for (i = 0; i < n; i++) {\n        tat[i] = wt[i] + bt[i];\n        if (i < n - 1) wt[i + 1] = tat[i];\n        printf(\"P%d WT=%d TAT=%d\\n\", i + 1, wt[i], tat[i]);\n    }\n\n    // Round Robin Scheduling\n    printf(\"\\nRound Robin:\\n\");\n    for (i = 0; i < n; i++) rem[i] = bt[i];\n    int time = 0;\n    while (1) {\n        int done = 1;\n        for (i = 0; i < n; i++) {\n            if (rem[i] > 0) {\n                done = 0;\n                if (rem[i] > t) {\n                    time += t;\n                    rem[i] -= t;\n                } else {\n                    time += rem[i];\n                    rem[i] = 0;\n                    printf(\"P%d completed at %d\\n\", i + 1, time);\n                }\n            }\n        }\n        if (done) break;\n    }\n    return 0;\n}"
  },
  {
    "id": "practical-4",
    "title": "Practical 4",
    "description": "Multithreading and Execution Time",
    "language": "C",
    "code": "#include <stdio.h>\n#include <pthread.h>\n#include <time.h>\n\nvoid* task(void* arg)\n{\n    printf(\"Thread %d is running\\n\", *(int*)arg);\n    return NULL;\n}\n\nint main()\n{\n    pthread_t t[4];\n    int id[4];\n\n    clock_t start = clock();\n\n    for(int i = 0; i < 4; i++)\n    {\n        id[i] = i + 1;\n        pthread_create(&t[i], NULL, task, &id[i]);\n    }\n\n    for(int i = 0; i < 4; i++)\n        pthread_join(t[i], NULL);\n\n    clock_t end = clock();\n\n    printf(\"\\nExecution Time: %.4f seconds\\n\",\n           (double)(end-start)/CLOCKS_PER_SEC);\n\n    return 0;\n}"
  },
  {
    "id": "practical-5",
    "title": "Practical 5",
    "description": "Inter-Process Communication (Pipe, Shared Memory, Message Queue)",
    "language": "C",
    "code": "\n#include <stdio.h>\n#include <unistd.h>\n#include <sys/ipc.h>\n#include <sys/shm.h>\n#include <sys/msg.h>\n\nstruct message\n{\n    long type;\n    char text[50];\n};\n\nint main()\n{\n    // 1. Pipe\n    int fd[2];\n    char buf[50];\n\n    pipe(fd);\n    write(fd[1], \"Hello Pipe\", 11);\n    read(fd[0], buf, sizeof(buf));\n    printf(\"Pipe: %s\\n\", buf);\n\n    // 2. Shared Memory\n    int id = shmget(1234, 1024, 0666 | IPC_CREAT);\n    char *p = (char*)shmat(id, NULL, 0);\n\n    sprintf(p, \"Hello Shared Memory\");\n    printf(\"Shared Memory: %s\\n\", p);\n\n    shmdt(p);\n    shmctl(id, IPC_RMID, NULL);\n\n    // 3. Message Queue\n    int q = msgget(1234, 0666 | IPC_CREAT);\n    struct message m;\n\n    m.type = 1;\n    sprintf(m.text, \"Hello Message Queue\");\n\n    msgsnd(q, &m, sizeof(m.text), 0);\n    msgrcv(q, &m, sizeof(m.text), 1, 0);\n\n    printf(\"Message Queue: %s\\n\", m.text);\n\n    msgctl(q, IPC_RMID, NULL);\n\n    return 0;\n}\n"
  },
  {
    "id": "practical-6",
    "title": "Practical 6",
    "description": "Process Synchronization (Producer–Consumer)",
    "language": "C",
    "code": "\n#include stdio.h\n#include pthread.h\n#include semaphore.h\n\nint buffer = 0;\nsem_t empty, full;\npthread_mutex_t mutex;\n\nvoid producer(void arg)\n{\n    sem_wait(&empty);\n    pthread_mutex_lock(&mutex);\n\n    buffer = 10;\n    printf(Producer produced %dn, buffer);\n\n    pthread_mutex_unlock(&mutex);\n    sem_post(&full);\n    return NULL;\n}\n\nvoid consumer(void arg)\n{\n    sem_wait(&full);\n    pthread_mutex_lock(&mutex);\n\n    printf(Consumer consumed %dn, buffer);\n\n    pthread_mutex_unlock(&mutex);\n    sem_post(&empty);\n    return NULL;\n}\n\nint main()\n{\n    pthread_t p, c;\n\n    sem_init(&empty, 0, 1);\n    sem_init(&full, 0, 0);\n    pthread_mutex_init(&mutex, NULL);\n\n    pthread_create(&p, NULL, producer, NULL);\n    pthread_create(&c, NULL, consumer, NULL);\n\n    pthread_join(p, NULL);\n    pthread_join(c, NULL);\n\n    sem_destroy(&empty);\n    sem_destroy(&full);\n    pthread_mutex_destroy(&mutex);\n\n    return 0;\n}\n"
  },
  {
    "id": "practical-7",
    "title": "Practical 7",
    "description": "Banker's Algorithm and Deadlock Detection",
    "language": "C",
    "code": "\n#include <stdio.h>\n\nint main()\n{\n    int n=3, r=2;\n    int alloc[3][2]={{1,0},{0,1},{1,1}};\n    int max[3][2]={{2,1},{1,2},{2,2}};\n    int avail[2]={1,1};\n    int need[3][2], finish[3]={0}, work[2];\n\n    // Calculate Need\n    for(int i=0;i<n;i++)\n        for(int j=0;j<r;j++)\n            need[i][j]=max[i][j]-alloc[i][j];\n\n    // Banker's Algorithm\n    for(int j=0;j<r;j++)\n        work[j]=avail[j];\n\n    printf(\"Safe Sequence: \");\n\n    for(int k=0;k<n;k++)\n    {\n        for(int i=0;i<n;i++)\n        {\n            if(!finish[i] && need[i][0]<=work[0] &&\n                              need[i][1]<=work[1])\n            {\n                printf(\"P%d \",i);\n\n                for(int j=0;j<r;j++)\n                    work[j]+=alloc[i][j];\n\n                finish[i]=1;\n                break;\n            }\n        }\n    }\n\n    // Check Deadlock\n    int deadlock=0;\n\n    for(int i=0;i<n;i++)\n        if(!finish[i])\n        {\n            printf(\"\\nDeadlock at P%d\",i);\n            deadlock=1;\n        }\n\n    if(!deadlock)\n        printf(\"\\nSystem is Safe. No Deadlock.\");\n\n    return 0;\n}\n"
  },
  {
    "id": "practical-8",
    "title": "Practical 8",
    "description": "Page Replacement (FIFO, LRU, Optimal)",
    "language": "C",
    "code": "\n#include <stdio.h>\n\nint main()\n{\n    int p[]={1,2,3,1,4,5};\n    int n=6, f=3, a[3];\n    int faults, hits;\n\n    // FIFO\n    printf(\"\\nFIFO:\\n\");\n    faults=hits=0;\n\n    for(int i=0;i<f;i++) a[i]=-1;\n\n    for(int i=0;i<n;i++)\n    {\n        int found=0;\n        for(int j=0;j<f;j++)\n            if(a[j]==p[i]) found=1;\n\n        if(!found)\n        {\n            a[faults%f]=p[i];\n            faults++;\n        }\n        else hits++;\n    }\n    printf(\"Faults=%d Hits=%d\\n\",faults,hits);\n\n    // LRU\n    printf(\"\\nLRU:\\n\");\n    faults=hits=0;\n    int t[3]={0}, time=0;\n\n    for(int i=0;i<f;i++) a[i]=-1;\n\n    for(int i=0;i<n;i++)\n    {\n        int pos=-1;\n\n        for(int j=0;j<f;j++)\n            if(a[j]==p[i]) pos=j;\n\n        if(pos!=-1)\n        {\n            hits++;\n            t[pos]=++time;\n        }\n        else\n        {\n            int k=0;\n            for(int j=0;j<f;j++)\n            {\n                if(a[j]==-1) {k=j; break;}\n                if(t[j]<t[k]) k=j;\n            }\n            a[k]=p[i];\n            t[k]=++time;\n            faults++;\n        }\n    }\n    printf(\"Faults=%d Hits=%d\\n\",faults,hits);\n\n    // Optimal\n    printf(\"\\nOptimal:\\n\");\n    faults=hits=0;\n\n    for(int i=0;i<f;i++) a[i]=-1;\n\n    for(int i=0;i<n;i++)\n    {\n        int found=0;\n        for(int j=0;j<f;j++)\n            if(a[j]==p[i]) found=1;\n\n        if(found) hits++;\n        else\n        {\n            int k=-1, far=-1;\n\n            for(int j=0;j<f;j++)\n            {\n                int next=i+1;\n                while(next<n && pages[next]!=a[j])\n                    next++;\n\n                if(a[j]==-1) {k=j; break;}\n                if(next>far) {far=next; k=j;}\n            }\n\n            a[k]=p[i];\n            faults++;\n        }\n    }\n    printf(\"Faults=%d Hits=%d\\n\",faults,hits);\n\n    return 0;\n}\n"
  },
  {
    "id": "practical-9",
    "title": "Practical 9",
    "description": "File Allocation and Disk Scheduling",
    "language": "C",
    "code": "\n#include <stdio.h>\n#include <stdlib.h>\n\nint main()\n{\n    int n, a[20], head, i, j, total = 0, temp;\n\n    // File Allocation\n    printf(\"FILE ALLOCATION\\n\");\n    printf(\"Enter number of blocks: \");\n    scanf(\"%d\", &n);\n\n    printf(\"Enter starting block and file size: \");\n    int start, size;\n    scanf(\"%d%d\", &start, &size);\n\n    printf(\"Allocated blocks: \");\n    for(i = 0; i < size; i++)\n        printf(\"%d \", start + i);\n\n    // Disk Scheduling\n    printf(\"\\n\\nDISK SCHEDULING\\n\");\n    printf(\"Enter number of requests: \");\n    scanf(\"%d\", &n);\n\n    printf(\"Enter requests: \");\n    for(i = 0; i < n; i++)\n        scanf(\"%d\", &a[i]);\n\n    printf(\"Enter initial head position: \");\n    scanf(\"%d\", &head);\n\n    // FCFS\n    total = 0;\n    for(i = 0; i < n; i++)\n    {\n        total += abs(head - a[i]);\n        head = a[i];\n    }\n    printf(\"FCFS Head Movement = %d\\n\", total);\n\n    // SSTF\n    printf(\"Enter head position again: \");\n    scanf(\"%d\", &head);\n\n    total = 0;\n    for(i = 0; i < n; i++)\n    {\n        int min = 999, pos = -1;\n        for(j = 0; j < n; j++)\n        {\n            if(a[j] != -1 && abs(head-a[j]) < min)\n            {\n                min = abs(head-a[j]);\n                pos = j;\n            }\n        }\n        total += min;\n        head = a[pos];\n        a[pos] = -1;\n    }\n    printf(\"SSTF Head Movement = %d\\n\", total);\n\n    return 0;\n}\n"
  },
  {
    "id": "python-app",
    "title": "Python App",
    "description": "Decision Tree Classification Example",
    "language": "Python",
    "code": "from sklearn.tree import DecisionTreeClassifier\n\n# Training data\nX = [[30], [40], [50], [60], [70], [80]]\ny = [0, 0, 0, 1, 1, 1]\n\n# Train model\nmodel = DecisionTreeClassifier()\nmodel.fit(X, y)\n\n# Prediction\nmarks = [[65]]\nresult = model.predict(marks)\n\nif result[0] == 1:\n    print(\"Student Passed\")\nelse:\n    print(\"Student Failed\")"
  },
  {
    "id": "requirements-txt",
    "title": "requirements.txt",
    "description": "Python dependencies",
    "language": "Text",
    "code": "scikit-learn"
  },
  {
    "id": "dockerfile",
    "title": "Dockerfile",
    "description": "Docker configuration",
    "language": "Dockerfile",
    "code": "FROM python:3.11-slim\n\nWORKDIR /app\n\nCOPY requirements.txt .\n\nRUN pip install --no-cache-dir -r requirements.txt\n\nCOPY app.py .\n\nCMD [\"python\", \"app.py\"]"
  }
];
