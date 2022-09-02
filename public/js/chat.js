const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('#messageInput')
const $messageFormButton = $messageForm.querySelector('#submit')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector("#messages");
// templates

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#locationMessage-template").innerHTML;
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h-mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h-mm A')

    });
    $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})



$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

function valdiate() {
    console
    if (!$messageFormInput.value.length) {
        $messageFormButton.disabled = true;
    }
    else {
        $messageFormButton.disabled = false;

    }
}
