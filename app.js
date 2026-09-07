/* ==========================================================================
   Ερωτηματολόγιο μεταπτυχιακής έρευνας
   Στατική σελίδα· καμία εξωτερική βιβλιοθήκη πέραν του YouTube IFrame API.

   Ροή οθονών (αυστηρά προς τα εμπρός, χωρίς αλλαγή URL):
     Εισαγωγή → Ενότητα 1 (Δημογραφικά) → Βίντεο → Ενότητες 2-7 → Τελική

   Όλες οι απαντήσεις συγκεντρώνονται στο αντικείμενο ANSWERS και στέλνονται
   με ΕΝΑ POST στο τέλος (μία γραμμή ανά συμμετέχοντα).
   ========================================================================== */

(function () {
  'use strict';

  var API_URL = 'https://script.google.com/macros/s/AKfycbx1jtpeQ6tdP72grjoNlSmt0kMTXn5_t9gPNdsx-hzX9vOcoHJcvzRsZaSevFIqIKTmIg/exec';

  /* Ποσοστό της διάρκειας που πρέπει να έχει πραγματικά παρακολουθηθεί. */
  var REQUIRED_WATCH_RATIO = 0.95;

  var TOTAL_SECTIONS = 7;

  /* Περιεχόμενο τελικής οθόνης. */
  var FINAL_NOTE =
    'PGgyPs6kzq3Ou86/z4IgzrXPgc+Jz4TOt868zrHPhM6/zrvOv86zzq/Ov8+FPC9oMj4KPHA+' +
    'zqPOsc+CIM61z4XPh86xz4HOuc+Dz4TOv8+NzrzOtSDOuM61z4HOvM6sIM6zzrnOsSDPhM63' +
    'IM+Dz4XOvM68zrXPhM6/z4fOriDPg86xz4Igz4PPhM63zr0gz4DOsc+Bzr/Pjc+DzrEgzq3P' +
    'gc61z4XOvc6xLjwvcD4KPHA+zpPOuc6xIM67z4zOs86/z4XPgiDOtM65zrHPg8+GzqzOu865' +
    'z4POt8+CIM+EzrfPgiDOtc6zzrrPhc+Bz4zPhM63z4TOsc+CIM+Ez4nOvSDOsc+Azr/PhM61' +
    'zrvOtc+DzrzOrM+Ez4nOvSwgzr8gz4DOu86uz4HOt8+CIM+DzrrOv8+Az4zPgiDPhM63z4Ig' +
    'zrzOtc67zq3PhM63z4IgzrTOtc69IM+AzrHPgc6/z4XPg865zqzPg8+EzrfOus61IM+Az4HO' +
    'uc69IM6xz4DPjCDPhM63zr0gzr/Ou86/zrrOu86uz4HPic+Dzrcgz4TOv8+FIM61z4HPic+E' +
    'zrfOvM6xz4TOv867zr/Os86vzr/PhS48L3A+CjxwPs6jz4TOvyDPgM67zrHOr8+DzrnOvyDP' +
    'hM63z4Igzq3Pgc61z4XOvc6xz4Igz4fPgc63z4POuc68zr/PgM6/zrnOrs64zrfOus6xzr0g' +
    'zrTPjc6/IM60zrnOsc+Gzr/Pgc61z4TOuc66zq3PgiDOtc66zrTOv8+Hzq3PgiDPhM6/z4Ug' +
    'zq/OtM65zr/PhSDOtc66z4DOsc65zrTOtc+Fz4TOuc66zr/PjSDOss6vzr3PhM61zr8uIM6j' +
    'zrUgzr/Pgc65z4POvM6tzr3Otc+CIM+AzrXPgc65z4DPhM+Oz4POtc65z4Igzr8gz4DOsc+B' +
    'zr/Phc+DzrnOsc+Dz4TOrs+CIM6uz4TOsc69IM+Az4HOsc6zzrzOsc+EzrnOus+MIM6sz4TO' +
    'v868zr8gz4DOv8+FIM6yzrnOvc+EzrXOv8+DzrrOv8+Azq7OuM63zrrOtSDPhs+Fz4POuc66' +
    'zqwsIM61zr3PjiDPg861IM6szrvOu861z4Igz4fPgc63z4POuc68zr/PgM6/zrnOrs64zrfO' +
    'us61IM6tzr3OsSDPiM63z4bOuc6xzrrPjCDOv868zr/Or8+JzrzOsSAoQUkgQXZhdGFyIC8g' +
    'RGlnaXRhbCBUd2luKSDPhM6/z4Ugzq/OtM65zr/PhSDPgM+Bzr/Pg8+Oz4DOv8+FLCDPhM6/' +
    'IM6/z4DOv86vzr8gzrTOt868zrnOv8+Fz4HOs86uzrjOt866zrUgzrzOtSDPhM63IM+Hz4HO' +
    'rs+Dzrcgz4TOtc+Hzr3Ov867zr/Os865z47OvSDOpM61z4fOvc63z4TOrs+CIM6dzr/Ot868' +
    'zr/Pg8+Nzr3Ot8+CLjwvcD4KPHA+zqPOus6/z4DPjM+CIM+EzrfPgiDOrc+BzrXPhc69zrHP' +
    'giDOtc6vzr3Osc65IM63IM60zrnOtc+BzrXPjc69zrfPg863IM+Ezr/PhSDPhM+Bz4zPgM6/' +
    'z4UgzrzOtSDPhM6/zr0gzr/PgM6/zq/OvyDOtyDOvM6/z4HPhs6uIM+Ezr/PhSDPgM6xz4HO' +
    'v8+Fz4POuc6xz4PPhM6uIM61z4DOt8+BzrXOrM62zrXOuSDPhM63IM68zrHOuM63z4POuc6x' +
    'zrrOriDOtc68z4DOtc65z4HOr86xLCDPhM63zr0gzrHOr8+DzrjOt8+DzrcgzrrOv865zr3P' +
    'ic69zrnOus6uz4Igz4DOsc+Bzr/Phc+Dzq/Osc+CLCDPhM63zr0gzrHOvc+EzrnOu86xzrzO' +
    'ss6xzr3PjM68zrXOvc63IM6xz4XOuM61zr3PhM65zrrPjM+EzrfPhM6xIM66zrHOuSDPhM63' +
    'IM+Dz4XOvc6/zrvOuc66zq4gzrHPgM6/zrTOv8+Hzq4gz4TOv8+FIM61zrrPgM6xzrnOtM61' +
    'z4XPhM65zrrOv8+NIM+AzrXPgc65zrXPh86/zrzOrc69zr/PhS48L3A+CjxwPs6fzrkgzrHP' +
    'gM6xzr3PhM6uz4POtc65z4Igz4POsc+CIM64zrEgz4PPhc68zrLOrM67zr/Phc69IM+Dz4TO' +
    't869IM66zrHOu8+Nz4TOtc+BzrcgzrrOsc+EzrHOvc+MzrfPg863IM+Ezr/PhSDPgc+MzrvO' +
    'v8+FIM+Azr/PhSDOvM+Azr/Pgc6/z43OvSDOvc6xIM60zrnOsc60z4HOsc68zrHPhM6vz4PO' +
    'v8+Fzr0gzr/OuSDPhM61z4fOvc6/zrvOv86zzq/Otc+CIM6kzrXPh869zrfPhM6uz4Igzp3O' +
    'v863zrzOv8+Dz43Ovc63z4Igz4PPhM63IM+Dz43Os8+Hz4HOv869zrcgz4jOt8+GzrnOsc66' +
    'zq4gzrXOus+AzrHOr860zrXPhc+DzrcuPC9wPgo8cD7Oo86xz4IgzrXPhc+HzrHPgc65z4PP' +
    'hM6/z43OvM61IM6zzrnOsSDPhM6/zr0gz4fPgc+Mzr3OvyDOus6xzrkgz4TOtyDPg8+FzrzO' +
    'ss6/zrvOriDPg86xz4Igz4PPhM63zr0gzr/Ou86/zrrOu86uz4HPic+Dzrcgz4TOt8+CIM6t' +
    'z4HOtc+Fzr3Osc+CLjwvcD4K';

  /* ------------------------------------------------------------------
     Κλίμακα Likert (τιμές 1-5, ετικέτες ορατές)
     ------------------------------------------------------------------ */

  var LIKERT = [
    { value: 1, label: 'Διαφωνώ απόλυτα' },
    { value: 2, label: 'Διαφωνώ' },
    { value: 3, label: 'Ούτε συμφωνώ ούτε διαφωνώ' },
    { value: 4, label: 'Συμφωνώ' },
    { value: 5, label: 'Συμφωνώ απόλυτα' }
  ];

  /* ------------------------------------------------------------------
     Ορισμός ενοτήτων
     ------------------------------------------------------------------ */

  function likert(key, text) {
    return { key: key, text: text, type: 'likert' };
  }

  var SECTIONS = [
    {
      index: 1,
      title: 'Λίγα λόγια για εσάς',
      intro: 'Οι παρακάτω ερωτήσεις αφορούν το προφίλ σας και την εμπειρία σας με διαδικτυακά μαθήματα και τεχνολογίες Τεχνητής Νοημοσύνης. Οι απαντήσεις σας θα χρησιμοποιηθούν αποκλειστικά για τη στατιστική ανάλυση της έρευνας.',
      items: [
        {
          key: 'DEM1_age', text: 'Ηλικία:', type: 'radio', layout: 'inline',
          options: ['18–24', '25–34', '35–44', '45–54', '55–64', 'Άνω των 65']
        },
        {
          key: 'DEM2_gender', text: 'Φύλο:', type: 'radio',
          options: ['Άνδρας', 'Γυναίκα', 'Άλλο / Δεν επιθυμώ να απαντήσω']
        },
        {
          key: 'DEM3_edu', text: 'Εκπαιδευτικό επίπεδο:', type: 'radio',
          options: [
            'Προπτυχιακός/ή φοιτητής/τρια',
            'Μεταπτυχιακός/ή φοιτητής/τρια',
            'Υποψήφιος/α διδάκτορας',
            'Απόφοιτος/η ΑΕΙ',
            { label: 'Άλλο:', value: 'Άλλο' }
          ],
          followUp: {
            key: 'DEM3_edu_other',
            when: 'Άλλο',
            placeholder: 'Προσδιορίστε'
          }
        },
        {
          key: 'DEM4_freq',
          text: 'Πόσο συχνά παρακολουθείτε διαδικτυακά μαθήματα ή εκπαιδευτικά βίντεο;',
          type: 'radio',
          options: ['Ποτέ', 'Σπάνια', 'Μερικές φορές', 'Συχνά', 'Πολύ συχνά']
        },
        {
          key: 'DEM5_ai',
          text: 'Πόσο εξοικειωμένος/η είστε με εργαλεία Τεχνητής Νοημοσύνης;',
          type: 'radio',
          options: ['Καθόλου', 'Λίγο', 'Μέτρια', 'Πολύ', 'Πάρα πολύ']
        }
      ]
    },
    {
      index: 2,
      title: 'Μαθησιακή εμπειρία',
      intro: 'Παρακαλώ απαντήστε στις παρακάτω ερωτήσεις με βάση το βίντεο μαθήματος που μόλις παρακολουθήσατε. Δεν υπάρχουν σωστές ή λάθος απαντήσεις. Μας ενδιαφέρει η προσωπική σας εμπειρία.',
      items: [
        likert('LE1', 'Το μάθημα ήταν εύκολο να το παρακολουθήσω.'),
        likert('LE2', 'Το περιεχόμενο παρουσιάστηκε με σαφήνεια.'),
        likert('LE3', 'Κατάλαβα τα βασικά σημεία του μαθήματος.'),
        likert('LE4', 'Η διάρκεια του βίντεο ήταν κατάλληλη.'),
        likert('LE5', 'Το μάθημα διατήρησε το ενδιαφέρον μου.'),
        likert('LE6', 'Θα μπορούσα να παρακολουθήσω και άλλο μάθημα με αντίστοιχο τρόπο παρουσίασης.')
      ]
    },
    {
      index: 3,
      title: 'Ο τρόπος παρουσίασης',
      items: [
        likert('SP1', 'Ένιωσα ότι ο παρουσιαστής απευθυνόταν στον θεατή με άμεσο τρόπο.'),
        likert('SP2', 'Η παρουσίαση μου δημιούργησε αίσθηση ανθρώπινης παρουσίας.'),
        likert('SP3', 'Ο παρουσιαστής κατάφερε να διατηρήσει την προσοχή μου.'),
        likert('SP4', 'Ο τρόπος επικοινωνίας του παρουσιαστή ήταν φιλικός.')
      ]
    },
    {
      index: 4,
      title: 'Ο παρουσιαστής',
      items: [
        likert('AU1', 'Ο παρουσιαστής έδειχνε να γνωρίζει καλά το αντικείμενο που παρουσίαζε.'),
        likert('AU2', 'Ο παρουσιαστής μου ενέπνευσε εμπιστοσύνη.'),
        likert('AU3', 'Ένιωσα ότι το μάθημα έχει προσωπικό χαρακτήρα.')
      ]
    },
    {
      index: 5,
      title: 'Εμπειρία παρακολούθησης',
      items: [
        likert('NA1', 'Η συνολική παρουσίαση μου φάνηκε φυσική.'),
        likert('NA2', 'Ένιωθα άνετα κατά την παρακολούθηση.'),
        likert('NA3', 'Η φωνή του παρουσιαστή ήταν ευχάριστη.'),
        likert('NA4', 'Η φωνή του παρουσιαστή ταίριαζε με την εικόνα και είχαν καλή συνοχή μεταξύ τους.'),
        likert('NA5', 'Η παρουσίαση διατήρησε την προσοχή μου καθ\' όλη τη διάρκειά της.'),
        likert('NA6', 'Δεν παρατήρησα στοιχεία που να μου φαίνονται αφύσικα κατά την παρουσίαση.')
      ]
    },
    {
      index: 6,
      title: 'Συνολική αξιολόγηση',
      items: [
        likert('OV1', 'Συνολικά, η εμπειρία παρακολούθησης ήταν θετική.'),
        likert('OV2', 'Θα εμπιστευόμουν αυτόν τον παρουσιαστή για να παρακολουθήσω ένα πλήρες διαδικτυακό μάθημα.'),
        likert('OV3', 'Θεωρώ ότι αυτός ο τρόπος παρουσίασης μπορεί να χρησιμοποιηθεί αποτελεσματικά στην εξ αποστάσεως εκπαίδευση.'),
        likert('OV4', 'Θα πρότεινα αντίστοιχο εκπαιδευτικό βίντεο σε άλλους φοιτητές ή εκπαιδευόμενους.')
      ]
    },
    {
      index: 7,
      title: 'Τελικές ερωτήσεις',
      submit: true,
      items: [
        {
          key: 'PR1_type', text: 'Πιστεύετε ότι ο παρουσιαστής του βίντεο ήταν:',
          type: 'radio',
          options: [
            'Πραγματικό άτομο σε φυσική βιντεοσκόπηση',
            'Ψηφιακά επεξεργασμένο ή συνθετικά παραγόμενο άτομο',
            'Δεν είμαι σίγουρος/η'
          ]
        },
        {
          key: 'PR2_confidence', text: 'Πόσο σίγουρος/η είστε για την παραπάνω απάντησή σας;',
          type: 'radio',
          options: [
            'Καθόλου σίγουρος/η', 'Λίγο σίγουρος/η', 'Μέτρια σίγουρος/η',
            'Πολύ σίγουρος/η', 'Απόλυτα σίγουρος/η'
          ]
        },
        {
          key: 'PR3_knew', text: 'Γνωρίζατε τον παρουσιαστή πριν από τη συμμετοχή σας;',
          type: 'radio', layout: 'inline',
          options: ['Ναι', 'Όχι']
        },
        {
          key: 'PR4_familiarity', text: 'Πόσο καλά τον γνωρίζατε;',
          type: 'radio',
          showIf: { key: 'PR3_knew', value: 'Ναι' },
          options: [
            'Τον έχω δει μόνο μία-δύο φορές',
            'Τον γνωρίζω ως συμφοιτητή/διδάσκοντα',
            'Έχω συνεργαστεί μαζί του',
            'Είναι προσωπικός γνωστός'
          ]
        },
        {
          key: 'comments',
          text: 'Υπάρχει κάποιο σχόλιο ή παρατήρηση που θα θέλατε να μοιραστείτε σχετικά με το βίντεο ή την εμπειρία παρακολούθησης;',
          type: 'textarea',
          optional: true
        }
      ]
    }
  ];

  /* Σειρά πεδίων στο JSON που στέλνεται στο backend. */
  var PAYLOAD_KEYS = [
    'version', 'email',
    'DEM1_age', 'DEM2_gender', 'DEM3_edu', 'DEM3_edu_other', 'DEM4_freq', 'DEM5_ai',
    'LE1', 'LE2', 'LE3', 'LE4', 'LE5', 'LE6',
    'SP1', 'SP2', 'SP3', 'SP4',
    'AU1', 'AU2', 'AU3',
    'NA1', 'NA2', 'NA3', 'NA4', 'NA5', 'NA6',
    'OV1', 'OV2', 'OV3', 'OV4',
    'PR1_type', 'PR2_confidence', 'PR3_knew', 'PR4_familiarity',
    'comments'
  ];

  /* ------------------------------------------------------------------
     Κατάσταση
     ------------------------------------------------------------------ */

  var ANSWERS = {};
  var assignment = null;      // { version, videoId } — μόνο στη μνήμη
  var guardActive = false;    // προειδοποίηση εξόδου

  /* ------------------------------------------------------------------
     Βοηθητικά DOM
     ------------------------------------------------------------------ */

  function $(id) { return document.getElementById(id); }

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function decode(b64) {
    var binary = atob(b64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }

  function showScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove('is-active');
    $(id).classList.add('is-active');
    window.scrollTo(0, 0);
  }

  /* ------------------------------------------------------------------
     Δημιουργία οθονών ενοτήτων
     ------------------------------------------------------------------ */

  function normalizeOption(option) {
    return (typeof option === 'string')
      ? { label: option, value: option }
      : option;
  }

  function buildRadioGroup(item) {
    var group = el('div', item.layout === 'inline' ? 'opt-inline' : 'opt-stack');

    item.options.forEach(function (raw) {
      var option = normalizeOption(raw);
      var row = el('label', 'opt-row');
      var input = el('input');
      input.type = 'radio';
      input.name = item.key;
      input.value = option.value;

      var span = el('span');
      span.textContent = option.label;

      row.appendChild(input);
      row.appendChild(span);
      group.appendChild(row);
    });

    return group;
  }

  function buildLikertGroup(item) {
    var group = el('div', 'likert');

    LIKERT.forEach(function (point) {
      var cell = el('label', 'likert-cell');
      var input = el('input');
      input.type = 'radio';
      input.name = item.key;
      input.value = String(point.value);

      var span = el('span', 'likert-label');
      span.textContent = point.label;

      cell.appendChild(input);
      cell.appendChild(span);
      group.appendChild(cell);
    });

    return group;
  }

  function buildQuestion(item) {
    var wrap = el('div', 'question');
    wrap.id = 'q-' + item.key;
    wrap.dataset.key = item.key;

    /* Για το textarea χρησιμοποιούμε <label for>. Για τις ομάδες radio ένα
       <span>, ώστε να μη δεσμεύεται η ετικέτα σε ένα μόνο πεδίο. */
    var label = el(item.type === 'textarea' ? 'label' : 'span', 'q-text');
    label.id = 'label-' + item.key;
    label.textContent = item.text;
    if (item.type === 'textarea') label.setAttribute('for', 'input-' + item.key);
    wrap.appendChild(label);

    if (item.type === 'likert' || item.type === 'radio') {
      var group = item.type === 'likert'
        ? buildLikertGroup(item)
        : buildRadioGroup(item);
      group.setAttribute('role', 'radiogroup');
      group.setAttribute('aria-labelledby', label.id);
      wrap.appendChild(group);
    } else if (item.type === 'textarea') {
      var area = el('textarea', 'textarea');
      area.id = 'input-' + item.key;
      area.name = item.key;
      wrap.appendChild(area);
    }

    /* Συμπληρωματικό πεδίο κειμένου (π.χ. «Άλλο:» στο εκπαιδευτικό επίπεδο). */
    if (item.followUp) {
      var follow = el('div', 'follow-up');
      follow.id = 'follow-' + item.followUp.key;
      follow.hidden = true;

      var text = el('input', 'text-input');
      text.type = 'text';
      text.id = 'input-' + item.followUp.key;
      text.name = item.followUp.key;
      text.placeholder = item.followUp.placeholder || '';
      text.maxLength = 120;

      follow.appendChild(text);
      wrap.appendChild(follow);
    }

    var error = el('p', 'q-error');
    error.textContent = item.type === 'textarea'
      ? 'Παρακαλώ συμπληρώστε το πεδίο.'
      : 'Παρακαλώ επιλέξτε μία απάντηση.';
    error.hidden = true;
    wrap.appendChild(error);

    /* Υπό συνθήκη ερώτηση: κρυφή μέχρι να ισχύσει η συνθήκη. */
    if (item.showIf) wrap.hidden = true;

    return wrap;
  }

  function buildSectionScreen(section) {
    var screen = el('section', 'screen');
    screen.id = 'screen-s' + section.index;

    var card = el('div', 'card');

    var progress = el('p', 'progress');
    progress.textContent = 'Ενότητα ' + section.index + ' από ' + TOTAL_SECTIONS;
    card.appendChild(progress);

    var title = el('h2');
    title.textContent = section.title;
    card.appendChild(title);

    if (section.intro) {
      var intro = el('p', 'lead');
      intro.textContent = section.intro;
      card.appendChild(intro);
    }

    section.items.forEach(function (item) {
      card.appendChild(buildQuestion(item));
    });

    var sectionError = el('p', 'section-error');
    sectionError.id = 'section-error-' + section.index;
    sectionError.hidden = true;
    card.appendChild(sectionError);

    var actions = el('div', 'actions');
    var button = el('button', 'btn btn-primary');
    button.type = 'button';
    button.id = 'btn-s' + section.index;
    button.textContent = section.submit ? 'Υποβολή' : 'Επόμενο';
    actions.appendChild(button);
    card.appendChild(actions);

    screen.appendChild(card);
    return screen;
  }

  function buildAllSections() {
    var host = $('generated-screens');
    SECTIONS.forEach(function (section) {
      host.appendChild(buildSectionScreen(section));
      var button = $('btn-s' + section.index);
      button.addEventListener('click', function () {
        handleSectionAdvance(section, button);
      });
    });
  }

  /* ------------------------------------------------------------------
     Καταγραφή απαντήσεων και υπό συνθήκη πεδία
     ------------------------------------------------------------------ */

  function findItem(key) {
    for (var i = 0; i < SECTIONS.length; i++) {
      var items = SECTIONS[i].items;
      for (var j = 0; j < items.length; j++) {
        if (items[j].key === key) return items[j];
      }
    }
    return null;
  }

  function storeValue(key, rawValue) {
    var item = findItem(key);
    if (item && item.type === 'likert') {
      ANSWERS[key] = parseInt(rawValue, 10);
    } else {
      ANSWERS[key] = String(rawValue == null ? '' : rawValue).trim();
    }
  }

  /** Εμφανίζει/κρύβει τα υπό συνθήκη στοιχεία μετά από κάθε αλλαγή. */
  function refreshConditionals() {
    SECTIONS.forEach(function (section) {
      section.items.forEach(function (item) {

        /* Συμπληρωματικό πεδίο «Άλλο». */
        if (item.followUp) {
          var follow = $('follow-' + item.followUp.key);
          var shouldShow = ANSWERS[item.key] === item.followUp.when;

          if (shouldShow && follow.hidden) {
            follow.hidden = false;
            follow.classList.add('reveal');
          } else if (!shouldShow && !follow.hidden) {
            follow.hidden = true;
            follow.classList.remove('reveal');
            /* Καθαρίζουμε την τιμή ώστε να πάει κενή στο φύλλο. */
            $('input-' + item.followUp.key).value = '';
            ANSWERS[item.followUp.key] = '';
          }
        }

        /* Υπό συνθήκη ερώτηση (PR4). */
        if (item.showIf) {
          var wrap = $('q-' + item.key);
          var visible = ANSWERS[item.showIf.key] === item.showIf.value;

          if (visible && wrap.hidden) {
            wrap.hidden = false;
            wrap.classList.add('reveal');
          } else if (!visible && !wrap.hidden) {
            wrap.hidden = true;
            wrap.classList.remove('reveal');
            /* Απόκρυψη = καθαρισμός τιμής και επιλογών. */
            var inputs = wrap.querySelectorAll('input[type="radio"]');
            for (var i = 0; i < inputs.length; i++) inputs[i].checked = false;
            ANSWERS[item.key] = '';
            clearError(wrap);
          }
        }
      });
    });
  }

  function wireInputs() {
    document.addEventListener('change', function (event) {
      var target = event.target;
      if (!target.name) return;
      if (target.type === 'radio' || target.tagName === 'TEXTAREA' || target.type === 'text') {
        storeValue(target.name, target.value);
        var wrap = target.closest ? target.closest('.question') : null;
        if (wrap) clearError(wrap);
        refreshConditionals();
      }
    });

    /* Το κείμενο ενημερώνεται και κατά την πληκτρολόγηση. */
    document.addEventListener('input', function (event) {
      var target = event.target;
      if (!target.name) return;
      if (target.tagName === 'TEXTAREA' || target.type === 'text') {
        storeValue(target.name, target.value);
      }
    });
  }

  /* ------------------------------------------------------------------
     Έλεγχος υποχρεωτικών πεδίων
     ------------------------------------------------------------------ */

  function markError(wrap, message) {
    wrap.classList.add('is-invalid');
    var error = wrap.querySelector('.q-error');
    if (error) {
      if (message) error.textContent = message;
      error.hidden = false;
    }
  }

  function clearError(wrap) {
    wrap.classList.remove('is-invalid');
    var error = wrap.querySelector('.q-error');
    if (error) error.hidden = true;
  }

  function isBlank(value) {
    return value === undefined || value === null || value === '' ||
           (typeof value === 'number' && isNaN(value));
  }

  function validateSection(section) {
    var firstInvalid = null;

    section.items.forEach(function (item) {
      var wrap = $('q-' + item.key);
      clearError(wrap);

      if (item.optional) return;
      if (wrap.hidden) return;           // υπό συνθήκη ερώτηση που δεν φαίνεται

      if (isBlank(ANSWERS[item.key])) {
        markError(wrap);
        if (!firstInvalid) firstInvalid = wrap;
        return;
      }

      /* Το συμπληρωματικό πεδίο είναι υποχρεωτικό μόνο όσο είναι ορατό. */
      if (item.followUp) {
        var follow = $('follow-' + item.followUp.key);
        if (!follow.hidden && isBlank(ANSWERS[item.followUp.key])) {
          markError(wrap, 'Παρακαλώ συμπληρώστε το πεδίο.');
          if (!firstInvalid) firstInvalid = wrap;
        }
      }
    });

    var banner = $('section-error-' + section.index);
    if (firstInvalid) {
      banner.textContent = 'Παρακαλώ απαντήστε σε όλες τις ερωτήσεις πριν συνεχίσετε.';
      banner.hidden = false;
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    banner.hidden = true;
    return true;
  }

  /* ------------------------------------------------------------------
     Οθόνη εισαγωγής / συγκατάθεσης
     ------------------------------------------------------------------ */

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function handleIntro() {
    var emailWrap = $('q-email');
    var consentWrap = $('q-consent');
    var email = $('email').value.trim();
    var consent = $('consent').checked;
    var firstInvalid = null;

    clearError(emailWrap);
    clearError(consentWrap);

    if (!EMAIL_PATTERN.test(email)) {
      markError(emailWrap);
      firstInvalid = emailWrap;
    }
    if (!consent) {
      markError(consentWrap);
      if (!firstInvalid) firstInvalid = consentWrap;
    }
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    ANSWERS.email = email;
    guardActive = true;              // από εδώ και πέρα προειδοποιούμε στην έξοδο
    showScreen('screen-s1');
  }

  /* ------------------------------------------------------------------
     Πλοήγηση ενοτήτων
     ------------------------------------------------------------------ */

  function handleSectionAdvance(section, button) {
    if (!validateSection(section)) return;

    if (section.index === 1) {
      requestAssignment(button);
    } else if (section.submit) {
      submitAnswers(button);
    } else {
      showScreen('screen-s' + (section.index + 1));
    }
  }

  /* ------------------------------------------------------------------
     Ανάθεση έκδοσης (γίνεται στο τέλος των Δημογραφικών)
     ------------------------------------------------------------------ */

  function requestAssignment(button) {
    var banner = $('section-error-1');
    button.disabled = true;
    button.textContent = 'Φόρτωση...';
    banner.hidden = true;

    fetch(API_URL + '?action=assign', { method: 'GET' })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (!data || !data.videoId || !data.version) {
          throw new Error('Μη έγκυρη απόκριση.');
        }
        assignment = data;
        ANSWERS.version = data.version;
        button.disabled = false;
        button.textContent = 'Επόμενο';
        showScreen('screen-video');
        setupPlayer(data.videoId);
      })
      .catch(function () {
        button.disabled = false;
        button.textContent = 'Δοκιμάστε ξανά';
        banner.textContent = 'Δεν ήταν δυνατή η φόρτωση του μαθήματος. Ελέγξτε τη σύνδεσή σας και δοκιμάστε ξανά. Οι απαντήσεις σας δεν έχουν χαθεί.';
        banner.hidden = false;
      });
  }

  /* ==================================================================
     ΒΙΝΤΕΟ — έλεγχος πλήρους παρακολούθησης

     Το κουμπί «Συνέχεια στο ερωτηματολόγιο» ενεργοποιείται μόνο όταν
     ισχύουν ΚΑΙ ΤΑ ΔΥΟ:
       (1) ο player έφτασε σε κατάσταση ENDED, ΚΑΙ
       (2) ο δικός μας μετρητής πραγματικού χρόνου παρακολούθησης
           (τρέχει ΜΟΝΟ όσο η κατάσταση είναι PLAYING) έχει φτάσει
           τουλάχιστον στο 95% της διάρκειας του βίντεο.

     Ο δεύτερος όρος είναι αυτός που κλείνει τα παραθυράκια: ακόμη κι αν
     κάποιος καταφέρει να προκαλέσει ENDED χωρίς να δει το βίντεο, ο
     μετρητής δεν θα έχει μαζέψει αρκετό χρόνο. Ο μετρητής αθροίζει
     πραγματικό χρόνο (performance.now), όχι τη θέση του βίντεο, οπότε
     δεν επηρεάζεται από τυχόν άλματα στη γραμμή χρόνου.
     ================================================================== */

  var player = null;
  var watchedMs = 0;          // αθροιστικός πραγματικός χρόνος σε PLAYING
  var lastTickTs = null;      // χρονοσήμανση προηγούμενου δείγματος
  var hasEnded = false;       // έφτασε ποτέ σε ENDED
  var pollTimer = null;

  function setupPlayer(videoId) {
    loadYouTubeAPI(function () { createPlayer(videoId); });
  }

  function loadYouTubeAPI(callback) {
    if (window.YT && window.YT.Player) { callback(); return; }

    /* Το API καλεί αυτή τη global συνάρτηση όταν φορτώσει. */
    window.onYouTubeIframeAPIReady = callback;

    var script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = function () {
      showVideoError('Δεν ήταν δυνατή η φόρτωση του βίντεο. Ελέγξτε τη σύνδεσή σας και ανανεώστε τη σελίδα.');
    };
    document.head.appendChild(script);
  }

  function createPlayer(videoId) {
    var vars = {
      controls: 0,          // κανένα χειριστήριο του YouTube
      disablekb: 1,         // καμία συντόμευση πληκτρολογίου
      rel: 0,               // χωρίς προτεινόμενα βίντεο
      modestbranding: 1,
      fs: 0,                // χωρίς πλήρη οθόνη
      playsinline: 1,
      iv_load_policy: 3,    // χωρίς επισημάνσεις
      autoplay: 0
    };
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      vars.origin = location.origin;
    }

    player = new YT.Player('player', {
      videoId: videoId,
      playerVars: vars,
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    });
  }

  function onPlayerReady() {
    $('btn-playpause').disabled = false;
    updateReadout();
    /* Δειγματοληψία 4 φορές το δευτερόλεπτο. */
    pollTimer = setInterval(pollPlayer, 250);
  }

  function onPlayerStateChange(event) {
    var button = $('btn-playpause');

    if (event.data === YT.PlayerState.PLAYING) {
      button.textContent = 'Παύση';
    } else {
      button.textContent = 'Αναπαραγωγή';
    }

    if (event.data === YT.PlayerState.ENDED) {
      hasEnded = true;
      updateContinueState();
    }
  }

  function onPlayerError() {
    showVideoError('Παρουσιάστηκε πρόβλημα κατά τη φόρτωση του βίντεο. Παρακαλούμε ανανεώστε τη σελίδα και δοκιμάστε ξανά.');
  }

  function showVideoError(message) {
    var box = $('video-error');
    box.textContent = message;
    box.hidden = false;
  }

  /**
   * Καλείται κάθε 250ms. Αθροίζει πραγματικό χρόνο μόνο όσο ο player
   * βρίσκεται σε PLAYING και ενημερώνει την ένδειξη προόδου.
   */
  function pollPlayer() {
    if (!player || typeof player.getPlayerState !== 'function') return;

    var state = player.getPlayerState();
    var now = (window.performance && performance.now)
      ? performance.now()
      : Date.now();

    if (state === YT.PlayerState.PLAYING) {
      if (lastTickTs !== null) {
        var delta = now - lastTickTs;
        /* Αγνοούμε αφύσικα μεγάλα άλματα (π.χ. καρτέλα σε αναστολή). */
        if (delta > 0 && delta < 1000) watchedMs += delta;
      }
      lastTickTs = now;
    } else {
      lastTickTs = null;
    }

    updateReadout();
    updateContinueState();
  }

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    var total = Math.floor(seconds);
    var minutes = Math.floor(total / 60);
    var rest = total % 60;
    return minutes + ':' + (rest < 10 ? '0' : '') + rest;
  }

  function updateReadout() {
    if (!player || typeof player.getDuration !== 'function') return;

    var duration = player.getDuration() || 0;
    var current = player.getCurrentTime() || 0;

    $('time-readout').textContent = formatTime(current) + ' / ' + formatTime(duration);
    $('track-fill').style.width = duration > 0
      ? Math.min(100, (current / duration) * 100) + '%'
      : '0%';
  }

  function updateContinueState() {
    if (!player || typeof player.getDuration !== 'function') return;

    var duration = player.getDuration() || 0;
    var watchedSeconds = watchedMs / 1000;

    /* Και οι δύο όροι πρέπει να ισχύουν ταυτόχρονα. */
    var complete = hasEnded &&
                   duration > 0 &&
                   watchedSeconds >= duration * REQUIRED_WATCH_RATIO;

    $('btn-video-next').disabled = !complete;

    if (complete) {
      $('video-hint').textContent = 'Η παρακολούθηση ολοκληρώθηκε. Μπορείτε να συνεχίσετε.';
    } else if (hasEnded) {
      /* Έφτασε στο τέλος αλλά δεν παρακολουθήθηκε αρκετό μέρος. */
      $('video-hint').textContent = 'Το βίντεο δεν παρακολουθήθηκε στο σύνολό του. Παρακαλούμε πατήστε «Αναπαραγωγή» για να συνεχίσετε την παρακολούθηση.';
    }
  }

  function wireVideoControls() {
    $('btn-playpause').addEventListener('click', function () {
      if (!player) return;
      if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    });

    $('btn-video-next').addEventListener('click', function () {
      if ($('btn-video-next').disabled) return;
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
      showScreen('screen-s2');
    });

    /* Αυτόματη παύση όταν ο χρήστης αλλάξει καρτέλα ή παράθυρο. */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && player && typeof player.pauseVideo === 'function') {
        if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
      }
    });

    /* Καμία αλληλεπίδραση με τον player, ούτε μέσω δεξιού κλικ. */
    $('player-shield').addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
  }

  /* ------------------------------------------------------------------
     Υποβολή
     ------------------------------------------------------------------ */

  function buildPayload() {
    var payload = {};
    PAYLOAD_KEYS.forEach(function (key) {
      var value = ANSWERS[key];
      payload[key] = isBlank(value) ? '' : value;
    });
    return payload;
  }

  function submitAnswers(button) {
    var banner = $('section-error-7');
    button.disabled = true;
    button.textContent = 'Υποβολή...';
    banner.hidden = true;

    fetch(API_URL, {
      method: 'POST',
      /* text/plain ώστε να μην ενεργοποιηθεί CORS preflight (OPTIONS),
         το οποίο το Apps Script δεν υποστηρίζει. */
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(buildPayload())
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (!data || data.status !== 'ok') {
          throw new Error(data && data.message ? data.message : 'Αποτυχία υποβολής.');
        }
        guardActive = false;        // η υποβολή ολοκληρώθηκε — τέλος προειδοποίησης
        showFinalScreen();
      })
      .catch(function () {
        button.disabled = false;
        button.textContent = 'Υποβολή';
        banner.textContent = 'Η υποβολή δεν ολοκληρώθηκε. Ελέγξτε τη σύνδεσή σας και πατήστε ξανά «Υποβολή». Οι απαντήσεις σας δεν έχουν χαθεί.';
        banner.hidden = false;
      });
  }

  function showFinalScreen() {
    /* Το κείμενο μπαίνει στο DOM μόνο τώρα, μετά την υποβολή. */
    $('done-body').innerHTML = decode(FINAL_NOTE);
    showScreen('screen-done');
  }

  /* ------------------------------------------------------------------
     Προειδοποίηση εξόδου
     ------------------------------------------------------------------ */

  function wireUnloadGuard() {
    window.addEventListener('beforeunload', function (event) {
      if (!guardActive) return;
      event.preventDefault();
      event.returnValue = '';
      return '';
    });
  }

  /* ------------------------------------------------------------------
     Εκκίνηση
     ------------------------------------------------------------------ */

  function init() {
    buildAllSections();
    wireInputs();
    wireVideoControls();
    wireUnloadGuard();

    $('btn-intro-next').addEventListener('click', handleIntro);

    $('email').addEventListener('input', function () { clearError($('q-email')); });
    $('consent').addEventListener('change', function () { clearError($('q-consent')); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
