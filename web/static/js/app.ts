namespace MyApplication {
    import P = _mithril.MithrilBasicProperty;

    // To upgrade dom for Material Design Lite
    declare var componentHandler: any;
    const upgradeDom: _mithril.MithrilElementConfig = (element: Element, isInitialized: boolean, context: _mithril.MithrilContext) => {
        if(!isInitialized) {
            console.log("upgrade!");
            componentHandler.upgradeDom();
        }
    }

    class Todo {
        description: P<string>;
        done: P<boolean>;

        constructor({description}: {description: string}) {
            this.description = m.prop(description);
            this.done = m.prop(false);
        }
    }

    namespace MyComponent {
        class ViewModel {
            list: P<Todo[]>;
            description: P<string>;

            init() {
                this.list = m.prop([]);
                this.description = m.prop("");
            }

            add() {
                if (this.description()) {
                    this.list().push(new Todo({description: this.description()}));
                    this.description("");
                }
            }

            change_at(index: number): P<boolean>  {
                return this.list()[index].done;
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
                                     m("label.mdl-checkbox.mdl-js-checkbox.mdl-js-ripple-effect", { for: `checkbox-${index}` },
                                       m(`input[type=checkbox]#checkbox-${index}.mdl-checkbox__input`, {onclick: m.withAttr("checked", viewModel.change_at(index)), checked: task.done()})
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
