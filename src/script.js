$(document).ready(function () {
  const detailsForm = '#details-form';
  const detailsFormActive = 'details-form_active';

  const inputsClear = '#inputs-clear';

  const inputRowsCount = '#input-rows-count';
  const detailsFormInputs = '#details-form__inputs';

  const problemSolving = '#problem-solving';

  let calculatedValue = '';

  let countDetails_Rows = 0;
  const dataTimeForThreeMachines = [];
  const dataTimeForTwoMachines = [];
  const optimalJobSequence = [];

  const unoptimizedTimeInMachine_A = [];
  const unoptimizedTimeOutMachine_A = [];
  const unoptimizedTimeInMachine_B = [];
  const unoptimizedTimeOutMachine_B = [];
  const unoptimizedTimeInMachine_C = [];
  const unoptimizedTimeOutMachine_C = [];

  const timeInMachine_A = [];
  const timeOutMachine_A = [];
  const timeInMachine_B = [];
  const timeOutMachine_B = [];
  const timeInMachine_C = [];
  const timeOutMachine_C = [];


  $('#count-rows-form').submit((e) => {
    e.preventDefault();
    $(detailsForm).addClass(detailsFormActive);

    const countRows = Number($(inputRowsCount).val());

    let createdRowsInputs = '';

    if (countRows > countDetails_Rows) {
      for (let i = countDetails_Rows + 1; i <= countRows; i++) {
        createdRowsInputs += "<div class='form-group details-inputs-group' id='inputs-group-" + i + "'>";
        createdRowsInputs += "<input class='form-control details-input'  type='number' id=" + `'input-${i}1'` + "min='1' max='100' required>";
        createdRowsInputs += "<input class='form-control details-input'  type='number' id=" + `'input-${i}2'` + "min='1' max='100' required>";
        createdRowsInputs += "<input class='form-control details-input'  type='number' id=" + `'input-${i}3'` + "min='1' max='100' required>";
        createdRowsInputs += "</div>";
      }
      $(detailsFormInputs).append(createdRowsInputs);
      countDetails_Rows = countRows;
    } else if (countRows < countDetails_Rows) {
      for (let i = countDetails_Rows; i > countRows; i--) {
        $(`#inputs-group-${i}`).remove();
      }
      countDetails_Rows = countRows;
    }
    $(inputRowsCount).val('');
    $(problemSolving).empty();
  });

  $(inputsClear).on('click', () => {
    for (let i = 1; i <= countDetails_Rows; i++) {
      $(`#input-${i}1`).val('');
      $(`#input-${i}2`).val('');
      $(`#input-${i}3`).val('');
    }

    $(problemSolving).empty();
  });

  $(detailsForm).submit((e) => {
    e.preventDefault();
    dataTimeForThreeMachines.splice(0, dataTimeForThreeMachines.length);

    const firstMachineData = [];
    const secondMachineData = [];
    const thirdMachineData = [];

    for (let i = 1; i <= countDetails_Rows; i++) {
      firstMachineData.push($(`#input-${i}1`).val());
      secondMachineData.push($(`#input-${i}2`).val());
      thirdMachineData.push($(`#input-${i}3`).val());
    }

    dataTimeForThreeMachines.push(firstMachineData, secondMachineData, thirdMachineData);

    calculate();
  });

  function calculate() {
    $(problemSolving).empty();
    calculatedValue = '';

    const minElement_A = findMinElement(dataTimeForThreeMachines[0]);
    const maxElement_B = findMaxElement(dataTimeForThreeMachines[1]);
    const minElement_C = findMinElement(dataTimeForThreeMachines[2]);

    calculatedValue += '<p class="font-weight-bold calculated__step">Исходня таблица:</p>';

    calculatedValue += '<table border="1">';
    calculatedValue += '<tr><th>Работа i</th>';
    for (let i = 1; i <= dataTimeForThreeMachines[0].length; i++) {
      calculatedValue += '<th>' + i + '</th>';
    }
    calculatedValue += '</tr>';
    for (let i = 0; i < dataTimeForThreeMachines.length; i++) {
      calculatedValue += '<tr>';
      if (!i) {
        calculatedValue += '<td>Машина A</td>';
      } else if (!(i - 1)) {
        calculatedValue += '<td>Машина B</td>'
      } else {
        calculatedValue += '<td>Машина C</td>'
      }
      dataTimeForThreeMachines[i].forEach(item => {
        calculatedValue += '<td>' + item + '</td>';
      });
      calculatedValue += '</tr>';
    }
    calculatedValue += '</table>';

    calculatedValue += '<p class="font-weight-bold calculated__step">Шаг 1: Найдем min(A), max(B), min(C)</p>';
    calculatedValue += '<p class="w-100 d-flex justify-content-center"><span class="pr-1">min(A) = ' + minElement_A + ';</span>';
    calculatedValue += '<span class="pr-1">max(B) = ' + maxElement_B + ';</span>';
    calculatedValue += '<span>min(C) = ' + minElement_C + ';</span></p>';

    calculatedValue += '<p class="font-weight-bold calculated__step">Шаг 2: Проверим min(A) >= max(B) и min(C) >= max(B)</p>';

    if (minElement_A < maxElement_B && minElement_C < maxElement_B) {
      calculatedValue += '<p class="w-100 d-flex justify-content-center">В нашем случае дальнейшее вычисление невозможно,' +
        ' т.к. не одно из условий не выполняется :(</p>';
    } else {
      calculatedValue += '<p class="w-100 d-flex justify-content-center text-justify">В нашем случае хотя бы одно из условий выполняется, ' +
        'значит опредлим две машины G и H</p>';
      calculatedValue += '<p class="font-weight-bold calculated__step">Шаг 3: Установим, что</p>';
      calculatedValue += '<p class="w-100 d-flex justify-content-center mb-0">Машина G(i) = A(i) + B(i)</p>';
      calculatedValue += '<p class="w-100 d-flex justify-content-center">Машина H(i) = B(i) + C(i)</p>';
      calculatedValue += '<p class="w-100 d-flex justify-content-start">Получим:</p>';

      const gMachineData = [];
      const hMachineData = [];

      for (let i = 0; i < dataTimeForThreeMachines[0].length; i++) {
        gMachineData.push(Number(dataTimeForThreeMachines[0][i]) + Number(dataTimeForThreeMachines[1][i]));
        hMachineData.push(Number(dataTimeForThreeMachines[1][i]) + Number(dataTimeForThreeMachines[2][i]));
      }

      dataTimeForTwoMachines.push(gMachineData, hMachineData);

      calculatedValue += '<table border="1">';
      calculatedValue += '<tr><th>Работа i</th>';
      for (let i = 1; i <= dataTimeForTwoMachines[0].length; i++) {
        calculatedValue += '<th>' + i + '</th>';
      }
      calculatedValue += '</tr>';
      for (let i = 0; i < dataTimeForTwoMachines.length; i++) {
        calculatedValue += '<tr>';
        if (!i) {
          calculatedValue += '<td>Машина G</td>';
        } else {
          calculatedValue += '<td>Машина H</td>'
        }
        dataTimeForTwoMachines[i].forEach(item => {
          calculatedValue += '<td>' + item + '</td>';
        });
        calculatedValue += '</tr>';
      }
      calculatedValue += '</table>';

      calculatedValue += '<p class="font-weight-bold calculated__step">Шаг 4: Вычислим оптимизированную последовательность для двух машин</p>';

      calculatedValue += findOptimalSequence();
    }

    $(problemSolving).append(calculatedValue);

    emptyAllData()
  }

  function findOptimalSequence() {
    let gMachineData = dataTimeForTwoMachines[0].slice(0);
    let hMachineData = dataTimeForTwoMachines[1].slice(0);

    const circleIterations = gMachineData.length;

    for (let i = 0; i < gMachineData.length; i++) {
      optimalJobSequence.push(undefined);
    }

    for (let i = 0; i < circleIterations; i++) {
      const minElement_G = findMinElement(gMachineData);
      const minElement_H = findMinElement(hMachineData);

      if (minElement_G <= minElement_H) {
        if (checkCountOfMin(minElement_G, gMachineData) === 1) {
          const indexMinElement = gMachineData.indexOf(minElement_G);
          const indexUnreservedIndex = checkItemIsUndefined(optimalJobSequence, true);

          optimalJobSequence[indexUnreservedIndex] = Number(indexMinElement + 1);
          gMachineData[indexMinElement] = Infinity;
          hMachineData[indexMinElement] = Infinity;
        } else {
          const indexesMinElements = gMachineData.reduce((acc, item, index) => {
            if (item === minElement_G) {
              acc.push(index);
            }
            return acc;
          }, []);

          const hMachineElementsForMin_gMachine = indexesMinElements.reduce((acc, item) => {
            acc.push(hMachineData[item]);
            return acc;
          }, []);

          const minElement_hMachineFor_gMachine = findMinElement(hMachineElementsForMin_gMachine);
          const indexMinElement = hMachineData.indexOf(minElement_hMachineFor_gMachine);
          const indexUnreservedIndex = checkItemIsUndefined(optimalJobSequence, true);

          optimalJobSequence[indexUnreservedIndex] = Number(indexMinElement + 1);
          gMachineData[indexMinElement] = Infinity;
          hMachineData[indexMinElement] = Infinity;
        }
      } else {
        if (checkCountOfMin(minElement_H, hMachineData) === 1) {
          const indexMinElement = hMachineData.indexOf(minElement_H);
          const indexUnreservedIndex = checkItemIsUndefined(optimalJobSequence, false);

          optimalJobSequence[indexUnreservedIndex] = Number(indexMinElement + 1);
          gMachineData[indexMinElement] = Infinity;
          hMachineData[indexMinElement] = Infinity;
        } else {
          const indexesMinElements = hMachineData.reduce((acc, item, index) => {
            if (item === minElement_H) {
              acc.push(index);
            }
            return acc;
          }, []);

          const gMachineElementsForMin_hMachine = indexesMinElements.reduce((acc, item) => {
            acc.push(gMachineData[item]);
            return acc;
          }, []);

          const minElement_gMachineFor_hMachine = findMinElement(gMachineElementsForMin_hMachine);
          const indexMinElement = gMachineData.indexOf(minElement_gMachineFor_hMachine);
          const indexUnreservedIndex = checkItemIsUndefined(optimalJobSequence, false);

          optimalJobSequence[indexUnreservedIndex] = Number(indexMinElement + 1);
          gMachineData[indexMinElement] = Infinity;
          hMachineData[indexMinElement] = Infinity;
        }
      }
    }

    return calculateIdleTime();
  }

  function calculateIdleTime() {
    let calculatedValue = '';

    calculatedValue += '<p class="w-100 d-flex justify-content-start">Оптимизированная последовательность:</p>';

    calculatedValue += '<table border="1">';
    calculatedValue += '<tr>';
    for (let i = 0; i < optimalJobSequence.length; i++) {
      calculatedValue += '<td>' + optimalJobSequence[i] + '</td>';
    }
    calculatedValue += '</tr>';
    calculatedValue += '</table>';

    const unoptimizedMachine_A = dataTimeForThreeMachines[0].slice(0);
    const unoptimizedMachine_B = dataTimeForThreeMachines[1].slice(0);
    const unoptimizedMachine_C = dataTimeForThreeMachines[2].slice(0);

    const machine_A = optimalJobSequence.map(item => {
      return unoptimizedMachine_A[Number(item) - 1];
    });

    const machine_B = optimalJobSequence.map(item => {
      return unoptimizedMachine_B[Number(item) - 1];
    });

    const machine_C = optimalJobSequence.map(item => {
      return unoptimizedMachine_C[Number(item) - 1];
    });

    machine_A.forEach((item, index) => {
      if (!index) {
        timeInMachine_A.push(index);
        timeOutMachine_A.push(Number(item));
      } else {
        timeInMachine_A.push(timeOutMachine_A[index - 1]);
        timeOutMachine_A.push(timeOutMachine_A[index - 1] + Number(item));
      }
    });

    machine_B.forEach((item, index) => {
      if (!index) {
        timeInMachine_B.push(timeOutMachine_A[index]);
        timeOutMachine_B.push(timeOutMachine_A[index] + Number(item));
      } else {
        if (timeOutMachine_A[index] >= timeOutMachine_B[index - 1]) {
          timeInMachine_B.push(timeOutMachine_A[index]);
          timeOutMachine_B.push(timeOutMachine_A[index] + Number(item));
        } else {
          timeInMachine_B.push(timeOutMachine_B[index - 1]);
          timeOutMachine_B.push(timeOutMachine_B[index - 1] + Number(item));
        }
      }
    });

    machine_C.forEach((item, index) => {
      if (!index) {
        timeInMachine_C.push(timeOutMachine_B[index]);
        timeOutMachine_C.push(timeOutMachine_B[index] + Number(item));
      } else {
        if (timeOutMachine_B[index] >= timeOutMachine_C[index - 1]) {
          timeInMachine_C.push(timeOutMachine_B[index]);
          timeOutMachine_C.push(timeOutMachine_B[index] + Number(item));
        } else {
          timeInMachine_C.push(timeOutMachine_C[index - 1]);
          timeOutMachine_C.push(timeOutMachine_C[index - 1] + Number(item));
        }
      }
    });

    calculatedValue += '<p class="font-weight-bold calculated__step">Шаг 5: Вычислим время при оптимизированной последовательности</p>';

    calculatedValue += '<table border="1">';
    calculatedValue += '<tr><th rowspan="2">Последовательность работ</th>';
    calculatedValue += '<th colspan="2">Машина А</th><th colspan="2">Машина B</th><th colspan="2">Машина C</th>';
    calculatedValue += '</tr>';
    calculatedValue += '<tr>';
    calculatedValue += '<th>Начало</th><th>Конец</th><th>Начало</th><th>Конец</th><th>Начало</th><th>Конец</th>';
    calculatedValue += '</tr>';

    for (let i = 0; i < optimalJobSequence.length; i++) {
      calculatedValue += '<tr>';
      calculatedValue += '<td>' + optimalJobSequence[i] + '</td>';
      calculatedValue += '<td>' + timeInMachine_A[i] + '</td>';
      calculatedValue += '<td>' + timeOutMachine_A[i] + '</td>';
      calculatedValue += '<td>' + timeInMachine_B[i] + '</td>';
      calculatedValue += '<td>' + timeOutMachine_B[i] + '</td>';
      calculatedValue += '<td>' + timeInMachine_C[i] + '</td>';
      calculatedValue += '<td>' + timeOutMachine_C[i] + '</td>';
      calculatedValue += '</tr>';
    }

    calculatedValue += '</table>';

    unoptimizedMachine_A.forEach((item, index) => {
      if (!index) {
        unoptimizedTimeInMachine_A.push(index);
        unoptimizedTimeOutMachine_A.push(Number(item));
      } else {
        unoptimizedTimeInMachine_A.push(unoptimizedTimeOutMachine_A[index - 1]);
        unoptimizedTimeOutMachine_A.push(unoptimizedTimeOutMachine_A[index - 1] + Number(item));
      }
    });

    unoptimizedMachine_B.forEach((item, index) => {
      if (!index) {
        unoptimizedTimeInMachine_B.push(unoptimizedTimeOutMachine_A[index]);
        unoptimizedTimeOutMachine_B.push(unoptimizedTimeOutMachine_A[index] + Number(item));
      } else {
        if (unoptimizedTimeOutMachine_A[index] >= unoptimizedTimeOutMachine_B[index - 1]) {
          unoptimizedTimeInMachine_B.push(unoptimizedTimeOutMachine_A[index]);
          unoptimizedTimeOutMachine_B.push(unoptimizedTimeOutMachine_A[index] + Number(item));
        } else {
          unoptimizedTimeInMachine_B.push(unoptimizedTimeOutMachine_B[index - 1]);
          unoptimizedTimeOutMachine_B.push(unoptimizedTimeOutMachine_B[index - 1] + Number(item));
        }
      }
    });

    unoptimizedMachine_C.forEach((item, index) => {
      if (!index) {
        unoptimizedTimeInMachine_C.push(unoptimizedTimeOutMachine_B[index]);
        unoptimizedTimeOutMachine_C.push(unoptimizedTimeOutMachine_B[index] + Number(item));
      } else {
        if (unoptimizedTimeOutMachine_B[index] >= unoptimizedTimeOutMachine_C[index - 1]) {
          unoptimizedTimeInMachine_C.push(unoptimizedTimeOutMachine_B[index]);
          unoptimizedTimeOutMachine_C.push(unoptimizedTimeOutMachine_B[index] + Number(item));
        } else {
          unoptimizedTimeInMachine_C.push(unoptimizedTimeOutMachine_C[index - 1]);
          unoptimizedTimeOutMachine_C.push(unoptimizedTimeOutMachine_C[index - 1] + Number(item));
        }
      }
    });

    const unoptimizedIdleOnMachine_A = unoptimizedTimeOutMachine_C[(unoptimizedTimeOutMachine_C.length - 1)] - unoptimizedTimeOutMachine_A[(unoptimizedTimeOutMachine_A.length - 1)];
    let unoptimizedIdleOnMachine_B = unoptimizedTimeInMachine_B[0] + unoptimizedTimeOutMachine_C[(unoptimizedTimeOutMachine_C.length - 1)] - unoptimizedTimeOutMachine_B[(unoptimizedTimeOutMachine_B.length - 1)];
    let unoptimizedIdleOnMachine_C = unoptimizedTimeInMachine_C[0];

    for (let i = 1; i < unoptimizedTimeOutMachine_A.length; i++) {
      unoptimizedIdleOnMachine_B += (unoptimizedTimeInMachine_B[i] - unoptimizedTimeOutMachine_B[(i - 1)]);
      unoptimizedIdleOnMachine_C += (unoptimizedTimeInMachine_C[i] - unoptimizedTimeOutMachine_C[(i - 1)]);
    }

    const unoptimizedIdleOnMachines = unoptimizedIdleOnMachine_A + unoptimizedIdleOnMachine_B + unoptimizedIdleOnMachine_C;

    calculatedValue += '<p class="w-100 d-flex justify-content-start">Общее время обработки деталей после оптимизации:</p>';
    calculatedValue += `<p class="w-100 d-flex justify-content-center">${timeOutMachine_C[(timeOutMachine_C.length - 1)]} у.е. времени</p>`;

    const idleOnMachine_A = timeOutMachine_C[(timeOutMachine_C.length - 1)] - timeOutMachine_A[(timeOutMachine_A.length - 1)];
    let idleOnMachine_B = timeInMachine_B[0] + timeOutMachine_C[(timeOutMachine_C.length - 1)] - timeOutMachine_B[(timeOutMachine_B.length - 1)];
    let idleOnMachine_C = timeInMachine_C[0];

    for (let i = 1; i < timeOutMachine_A.length; i++) {
      idleOnMachine_B += (timeInMachine_B[i] - timeOutMachine_B[(i - 1)]);
      idleOnMachine_C += (timeInMachine_C[i] - timeOutMachine_C[(i - 1)]);
    }

    calculatedValue += '<p class="w-100 d-flex justify-content-start">Время простоя машин (станков) после оптимизации:</p>';
    calculatedValue += `<p class="w-100 d-flex justify-content-center">Машины A - ${idleOnMachine_A} у.е. времени</p>`;
    calculatedValue += `<p class="w-100 d-flex justify-content-center">Машины B - ${idleOnMachine_B} у.е. времени</p>`;
    calculatedValue += `<p class="w-100 d-flex justify-content-center">Машины C - ${idleOnMachine_C} у.е. времени</p>`;

    const idleOnMachines = idleOnMachine_A + idleOnMachine_B + idleOnMachine_C;

    calculatedValue += `<p class="w-100 d-flex justify-content-start"><span class="font-weight-bold mr-1">Итого:</span>${idleOnMachines} у.е. времени</p>`;

    calculatedValue += `<p class="w-100 d-flex justify-content-start"><span class="font-weight-bold mr-1">До оптимизации:</span>${unoptimizedIdleOnMachines} у.е. времени</p>`;

    return calculatedValue;
  }

  function checkItemIsUndefined(array, start) {
    if (start) {
      if (array.some(item => item !== undefined)) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] === undefined) {
            return i;
          }
        }
      } else {
        return 0;
      }
    } else {
      if (array.some(item => item !== undefined)) {
        for (let i = (array.length - 1); i >= 0; i--) {
          if (array[i] === undefined) {
            return i;
          }
        }
      } else {
        return (array.length - 1);
      }
    }
  }

  function checkCountOfMin(minElement, array) {
    const minElements = array.filter(item => item === minElement);
    return minElements.length;
  }

  function findMinElement(array) {
    return Math.min.apply(null, array)
  }

  function findMaxElement(array) {
    return Math.max.apply(null, array)
  }

  function emptyAllData() {
    dataTimeForTwoMachines.splice(0, dataTimeForTwoMachines.length);
    optimalJobSequence.splice(0, optimalJobSequence.length);
    unoptimizedTimeInMachine_A.splice(0, unoptimizedTimeInMachine_A.length);
    unoptimizedTimeOutMachine_A.splice(0, unoptimizedTimeOutMachine_A.length);
    unoptimizedTimeInMachine_B.splice(0, unoptimizedTimeInMachine_B.length);
    unoptimizedTimeOutMachine_B.splice(0, unoptimizedTimeOutMachine_B.length);
    unoptimizedTimeInMachine_C.splice(0, unoptimizedTimeInMachine_C.length);
    unoptimizedTimeOutMachine_C.splice(0, unoptimizedTimeOutMachine_C.length);
    timeInMachine_A.splice(0, timeInMachine_A.length);
    timeOutMachine_A.splice(0, timeOutMachine_A.length);
    timeInMachine_B.splice(0, timeInMachine_B.length);
    timeOutMachine_B.splice(0, timeOutMachine_B.length);
    timeInMachine_C.splice(0, timeInMachine_C.length);
    timeOutMachine_C.splice(0, timeOutMachine_C.length);
  }
});
