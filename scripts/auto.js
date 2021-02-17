const Modal = {
    toggle(){
        document.querySelector(".modal-overlay").classList.toggle("active")
    },

    errortoggleof(){
        document.querySelector(".alerterror").classList.remove("active")

    },

    errortoggle(){
        document.querySelector(".alerterror").classList.toggle("active")

    }
};

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("high.finances:autotransactions")) || []
    },
    set(transactions){
        localStorage.setItem("high.finances:autotransactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(), 

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    }
}

const DOM = {
        transactionsContainer: document.querySelector("#AutoTransations"),

        addTransaction (transaction, index) {
            const div = document.createElement('div');
            const CSSclass = transaction.amount > 0 ? "income" : "expense"
            div.className = `card-auto ${CSSclass}`;
            div.innerHTML = DOM.innerHTMLTransaction(transaction)
            div.dataset.index = index;

            DOM.transactionsContainer.appendChild(div)
        },
    
        innerHTMLTransaction(transaction, index) {
    
            const html = `
            <img src="./assets/auto.svg" alt="Imagem de Automação de Transações">
            <div class="card-footer">
            <span>${transaction.name}<br> 
            <small>Dia ${transaction.day}</small> 
            </span>
            <img onclick="Transaction.remove(${index})" class="excludauto" src="./assets/exclud.svg" alt="Remover">
            </div>
            `
    
            return html
        },

        clearTransactions() {
            DOM.transactionsContainer.innerHTML = "";
        }
}

const Utils = {
    formatName(text) {
            var words = text.toLowerCase().split(" ");
            for (var a = 0; a < words.length; a++) {
                var w = words[a];
                words[a] = w[0].toUpperCase() + w.slice(1);
            }
            return words.join(" ");
    },

    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    formatDay(value) {
        value = Number(value)

        return value
    }
}

const Form = {

    name: document.querySelector("input#Transation-Name"),
    amount: document.querySelector("input#Transation-Amount"),
    day: document.querySelector("input#Transation-Day"),

    getValues(){
        return{
            name: Form.name.value,
            amount: Form.amount.value,
            day: Form.day.value,
        }
    },

    validateFields() {
        const { name, amount, day } = Form.getValues()
        if(name.trim() == ""|| amount.trim() == "" || day.trim() == "") {
            throw new Error("Por favor,preencha todos os campos")
        }
    },

    formatValues() {
        let { name, amount, day } = Form.getValues()

        name = Utils.formatName(name)
        amount = Utils.formatAmount(amount)
        day = Utils.formatDay(day) 

        return { name, amount, day }

    },

    clearFields(){
        Form.name.value = ""
        Form.amount.value = ""
        Form.day.value = ""
    },

    submit(event) {
        event.preventDefault();
        try {
            Form.validateFields();
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields();
            Modal.toggle()
        } catch (error) {
            document.querySelector(".alerterror").classList.toggle("active")
        }

    }
}

const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        Storage.set(Transaction.all)
    }, 

    reload(){
        DOM.clearTransactions();
        App.init();
    }
}

App.init()
