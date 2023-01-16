<?php
    $matches = [];
    $result = [];
    array_push($result, $argv[1]);
    $pattern = '/(?= ( \( (?: [^()]+ | (?1) )*+ \) ) )/x';
    $matched = preg_match_all($pattern, $argv[1], $matches);
    // echo $matched;
    foreach($matches[1] as $match){
        $match = $dataList = substr($match, 1, -1);;
        array_push($result, $match);
    }
    // echo implode(' ', $matches[1]);
    echo eval("return 3+4+3+;");