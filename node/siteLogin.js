export {printLoginPage};

function printLoginPage() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/signin.css">
        <link rel="stylesheet" href="bootstrap/css/bootstrap.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    
    
        <title>Social Media and Relations WebApp-P2AAU</title>
    </head>
    <body>
    <div class="text-center">
      <form id="loginBtn" class="form-signin">
        <img class="mb-4" src="https://www.mypeterinarian.com/wp-content/uploads/2020/10/jae-park-1198084-unsplash-1497x1600.jpg" alt="" width="72" height="72">
        <h1 class="h3 mb-3 font-weight-normal">Log ind</h1>
        <label for="inputEmail" class="sr-only">E-mail addresse</label>
        <input type="email" id="inputEmail" class="form-control" placeholder="E-mail addresse" required autofocus>
        <label for="inputPassword" class="sr-only">Adgangskode</label>
        <input type="password" id="inputPassword" class="form-control" placeholder="Adgangskode" required>
        <p id="errorField" style="visibility:hidden" class="text-danger">Ukendt fejl</p>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Log ind</button>
        <p class="mt-5 mb-3 text-muted">&copy; Copyright <script>document.write(new Date().getFullYear())</script></p>
      </form>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
      <script type="text/javascript" src="../node0/js/src/eventsource.min.js"></script>
      <script type="text/javascript" src="js/main-client.js"></script>
    </body>
    </html>`
}
