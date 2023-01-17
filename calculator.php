<?php
    $pattern = '/[1-9\+\-\*\/\(\)]/';
    // $matches = [];
    // $result = [];
    // array_push($result, $argv[1]);
    // $pattern = '/(?= ( \( (?: [^()]+ | (?1) )*+ \) ) )/x';
    $matched = preg_match($pattern, $argv[1]);
    
    if($matched == 0){
        echo Json_encode(['error' => true]);
        exit();
    }
    // // echo $matched;
    // foreach($matches[1] as $match){
    //     $match = $dataList = substr($match, 1, -1);;
    //     array_push($result, $match);
    // }
    try {
        $number = eval("return " . $argv[1] . ";");
        if(strlen($number) > 8){
            $number = sprintf("%.3e", $number);
        }
        $result = json_encode(['result' => $number]);
        echo $result;
    } catch (ParseError $e) {
        echo Json_encode(['error' => true]);
    }