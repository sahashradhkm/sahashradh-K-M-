<?php
// Wait for the Javascript frontend to send an equation here to calculate it
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_GET['calculate'])) {
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents('php://input'), true);
    
    $expr = $data['expression'] ?? '';
    
    // Security check 1: Don't let users type weird symbols (hackers love weird symbols)
    if (preg_match('/[^0-9\.\+\-\*\/\^\(\)\s%a-z]/i', $expr)) {
        echo json_encode(['error' => 'Invalid characters in expression.']);
        exit;
    }
    
    // Security check 2: Make sure the letters they sent are actually math functions like 'sin' and not a hacking command
    $test_expr = str_ireplace(['sin', 'cos', 'tan', 'sqrt', 'log', 'ln', 'pi', 'e'], '', $expr);
    if (preg_match('/[a-z]/i', $test_expr)) {
        echo json_encode(['error' => 'Invalid mathematical functions used.']);
        exit;
    }

    // Security check 3: Stop equations that are way too long (prevents the server from crashing/slowing down)
    if (strlen($expr) > 200) {
         echo json_encode(['error' => 'Expression limits exceeded.']);
         exit;
    }
    
    // Convert trigonometry functions to use Degrees safely (multiply by pi/180)
    // We use lowercase 'pi' here so it gets correctly swapped to M_PI in the next step
    $php_expr = preg_replace('/(sin|cos|tan)\(([^)]+)\)/i', '$1((pi/180)*($2))', $expr);

    // PHP understands things differently, so we swap remaining constants and operators
    $php_expr = str_ireplace(
        ['sqrt(', 'log(', 'ln(', 'pi', 'e', '^'],
        ['sqrt(', 'log10(', 'log(', 'M_PI', 'M_E', '**'],
        $php_expr
    );
    
    try {
        // Silently catch dumb math mistakes like dividing by zero so PHP doesn't spit out ugly errors to the frontend
        ob_start();
        $result = eval('return ' . $php_expr . ';');
        ob_end_clean();

        if ($result === false || is_null($result) || is_nan($result) || is_infinite($result)) {
             echo json_encode(['error' => 'Math Error']);
        } else {
             echo json_encode(['result' => $result]);
        }
    } catch (Throwable $e) {
        echo json_encode(['error' => 'Syntax Error']);
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Premium PHP Scientific Calculator</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
  <div class="calc-container">
    <div class="display-container">
      <div id="history"></div>
      <div id="display">0</div>
    </div>
    
    <div class="keypad">
      <!-- Scientific Functions -->
      <button class="btn sci-btn" data-val="sin(">sin</button>
      <button class="btn sci-btn" data-val="cos(">cos</button>
      <button class="btn sci-btn" data-val="tan(">tan</button>
      <button class="btn sci-btn" data-val="pi">π</button>
      <button class="btn action-btn bg-red" data-action="clear">AC</button>
      
      <button class="btn sci-btn" data-val="sqrt(">√</button>
      <button class="btn sci-btn" data-val="log(">log</button>
      <button class="btn sci-btn" data-val="ln(">ln</button>
      <button class="btn sci-btn" data-val="e">e</button>
      <button class="btn action-btn bg-orange" data-action="delete">DEL</button>
      
      <!-- Numbers & Basic Ops -->
      <button class="btn sci-btn" data-val="^">^</button>
      <button class="btn sci-btn" data-val="(">(</button>
      <button class="btn sci-btn" data-val=")">)</button>
      <button class="btn op-btn" data-val="/">÷</button>
      <button class="btn op-btn" data-val="*">×</button>

      <button class="btn num-btn" data-val="7">7</button>
      <button class="btn num-btn" data-val="8">8</button>
      <button class="btn num-btn" data-val="9">9</button>
      <button class="btn op-btn" data-val="-">−</button>
      <button class="btn sci-btn" data-val="%">%</button>

      <button class="btn num-btn" data-val="4">4</button>
      <button class="btn num-btn" data-val="5">5</button>
      <button class="btn num-btn" data-val="6">6</button>
      <button class="btn op-btn" data-val="+">+</button>
      <button class="btn action-btn bg-green grid-row-span" data-action="equals">=</button>

      <button class="btn num-btn" data-val="1">1</button>
      <button class="btn num-btn" data-val="2">2</button>
      <button class="btn num-btn" data-val="3">3</button>
      
      <button class="btn num-btn grid-col-span" data-val="0">0</button>
      <button class="btn num-btn" data-val="00">00</button>
      <button class="btn num-btn" data-val=".">.</button>
      
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>