namespace MyApplication {
    import P = _mithril.MithrilBasicProperty;

    // To use Phoenix.js
    declare var Phoenix: any;

    // To upgrade dom for Material Design Lite
    declare var componentHandler: any;
    const upgradeDom: _mithril.MithrilElementConfig = (element: Element, isInitialized: boolean, context: _mithril.MithrilContext) => {
        if(!isInitialized) {
            componentHandler.upgradeDom();
        } else {
            // Material Design Lite Checkbox Workaround
            // http://stackoverflow.com/questions/31413042/toggle-material-design-lite-checkbox/31419856#31419856
            let checkboxLabel = <any>element.querySelector("td label");
            let input = <HTMLInputElement>element.querySelector("td label input");
            if(input.checked) {
                checkboxLabel.MaterialCheckbox.check();
            } else {
                checkboxLabel.MaterialCheckbox.uncheck();
            }
        }
    }

    class Todo {
        description: P<string>;
        done: P<boolean>;

        constructor({description, done=false}: {description: string, done?: boolean}) {
            this.description = m.prop(description);
            this.done = m.prop(done);
        }
    }

    const socket = new Phoenix.Socket("/socket", {});
    socket.connect();
    const channel = socket.channel("rooms:lobby", {})
    channel.join();

    namespace MyComponent {
        class ViewModel {
            list: P<Todo[]>;
            description: P<string>;

            init() {
                this.list = m.prop([]);
                this.description = m.prop("");

                channel.on("sync_todo", ({body}) => {
                    m.startComputation();
                    const todos = body.map((todo: any) => new Todo(todo));
                    this.list(todos);
                    m.endComputation();
                })
            }

            add() {
                if (this.description()) {
                    this.list().push(new Todo({description: this.description()}));
                    this.description("");

                    channel.push("sync_todo", {body: this.list()}, 1000);
                }
            }

            change_at(index: number): (x: boolean) => void {
                return (checked: boolean) => {
                    this.list()[index].done(checked);

                    channel.push("sync_todo", {body: this.list()}, 1000);
                }
            }
        }
        const viewModel = new ViewModel();
        export const controller: _mithril.MithrilControllerFunction<any> = () => viewModel.init();
        export const view = () => {
            return m(".chatex-container", [
                m("h1", "Share Tasks"),
                m(".chatex-input", [
                    m(".mdl-textfield.mdl-js-textfield", [
                        m("input.mdl-textfield__input", {onchange: m.withAttr("value", viewModel.description), value: viewModel.description()})
                    ]),
                    m("button.mdl-button.mdl-js-button.mdl-button--raised.mdl-button--colored.mdl-js-ripple-effect", {onclick: viewModel.add.bind(viewModel)}, "追加")
                ]),
                m("table.chatex-tasks.mdl-data-table.mdl-js-data-table",
                  viewModel.list().map((task, index) => {
                      return m("tr.task", { config: upgradeDom },
                               [
                                   m("td.done.mdl-data-table__cell--non-numeric",
                                     m("label.mdl-checkbox.mdl-js-checkbox.mdl-js-ripple-effect", {for: `checkbox-${index}`},
                                       m(`input[type=checkbox]#checkbox-${index}.mdl-checkbox__input`, {onclick: m.withAttr("checked", viewModel.change_at(index), {}), checked: task.done()})
                                      )
                                    ),
                                   m("td.description.mdl-data-table__cell--non-numeric", {style: {textDecoration: task.done() ? "line-through" : "none"}}, task.description())
                               ]);
                  }))
            ])
        }
    }
    export const rootComponent = MyComponent;
}

m.mount(document.getElementById("root"), MyApplication.rootComponent);
