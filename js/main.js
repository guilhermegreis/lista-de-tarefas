
const Main = {

    tasks: [],

    init: function() {
        this.cache_selectors()
        this.bind_events()
        this.get_storaged()
        this.build_tasks()
},

    cache_selectors: function() {
        this.$check_buttons = document.querySelectorAll('.check')
        this.$input_task = document.querySelector('#input_task')
        this.$list = document.querySelector('#list')
        this.$remove_buttons = document.querySelectorAll('.remove')
    },

    bind_events: function() {
        const self = this

        this.$check_buttons.forEach(function(button){
            button.onclick = self.Events.checkbutton_click.bind(self)
        })

        this.$input_task.onkeypress = self.Events.input_task_keypress.bind(this)

        this.$remove_buttons.forEach(function(button){
            button.onclick = self.Events.removebutton_click.bind(self)
        })
    },

    get_storaged: function() {
        const tasks = localStorage.getItem('tasks')

        if(tasks){
            this.tasks = JSON.parse(tasks)
        } else {
            localStorage.setItem('tasks', JSON.stringify([]))
        }
    },

    get_task_html: function(task, is_done) {
        return `
        <li class="${is_done ? 'done' : ''}" data-task="${task}">
            <div class="check"></div>
            <label class="task">
                ${task}
            </label>
            <button class="remove"></button>
        </li>
    `
    },

    insert_html: function(element, html_string) {
        element.innerHTML += html_string

        this.cache_selectors()
        this.bind_events()
    },

    build_tasks: function() {
        let html = ''
        this.tasks.forEach(item => {
            html += this.get_task_html(item.task, item.done)
        })

        this.insert_html(this.$list, html)
    },

    Events: {
        checkbutton_click: function(e) {
           const li = e.target.parentElement
           const value = li.dataset['task']
           const is_done = li.classList.contains('done')


           const new_tasks_state = this.tasks.map(item => {
            if(item.task === value) {
                item.done = !is_done
            }

            return item
           })

           localStorage.setItem('tasks', JSON.stringify(new_tasks_state))

          if (!is_done) {
            return li.classList.add('done')
          }

          li.classList.remove('done')
        },

        input_task_keypress: function(e) {
            const key = e.key
            const value = e.target.value
            const is_done = false

            if(key === 'Enter'){
                const task_html = this.get_task_html(value, is_done)

                this.insert_html(this.$list, task_html)

                e.target.value = ''

                const saved_tasks = localStorage.getItem('tasks')
                const saved_tasks_arr = JSON.parse(saved_tasks)

                const arr_tasks = [
                    {task: value, done: is_done},
                    ...saved_tasks_arr, 
                ]

                const json_tasks = JSON.stringify(arr_tasks)

                this.tasks = arr_tasks
                localStorage.setItem('tasks', json_tasks)
            }
        },

        removebutton_click: function(e){
            const li = e.target.parentElement
            const value = e.target.dataset['task']

            console.log(this.tasks)

            const new_tasks_state = this.tasks.filter(item => {
                console.log(item.task, value)
                return item.task !== value
            })

            localStorage.setItem('tasks', JSON.stringify(new_tasks_state))
            this.tasks = new_tasks_state

            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
            }, 300)
        }
    }
}

Main.init()