-- Seed poems for user 'varu' (admin)
-- Chapter 1: Safar-e-Zindagi (The Journey of Life) - 19 Poems

-- First, ensure varu user exists (pen name in display_name)
INSERT OR IGNORE INTO users (username, email, password_hash, role, display_name, bio, language_preference, is_featured)
VALUES (
  'varu',
  'varu@poetry-platform.com',
  -- Password: varu123 (SHA-256 hash)
  '91c02cbc3dbe552d39884ad1a8c944370930240b04ef153283ba2fdf72e05e24',
  'admin',
  'varu',
  'Admin poet sharing the journey of life through multilingual poetry',
  'hi',
  1
);

-- Get varu's user ID (will be used in all poems)
-- For this seed file, we'll assume varu has ID 1 (first user)

-- Poem 1: Waqt ka Takaza
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'वक्त का तकाझा',
  'वक्त का तकाझा केहरा,
सो जाओ, अंधेरी गलियोन मे ना घुमो,
आंख बंद करो, सून्हरे ख्वाबो मे खो जाओ,',
  'hi',
  1,
  'published',
  0,
  1
);

-- Poem 2: Ret si Fisal Rahi Zindagi
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'रेत सी फिसल रही जिंदगी',
  'रेत सी फिसल रही जिंदगी हातों से,
     कोई तो रोक लो ईसे जरा!
     
  चाहते हैं जिन्हे दिल से,
      साथ जिनके जीये वो हसीन पल,
   आज साथ छोड़ चले हैं दूर,
      कोई तो रोक लो ईन्हे जरा!
      
 कुछ और पल जीना चाहते हैं हम उन के साथ,
        कुछ और पल जी ले जरा,
        हॅंस ले, गां ले, रो ले जरा,
 फिर ये लम्हे शायद लौटकर आए न कभी,
   
रेत सी फिसल रही जिंदगी हातों से,
     कोई तो रोक लो ईसे जरा!',
  'hi',
  1,
  'published',
  1,
  1
);

-- Poem 3: Maximist (English Tribute)
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'Maximist - A Tribute',
  '11 years old yet no arrogance in attitude,
Humble, down to earth, always ready to help,
A young soul with wisdom beyond years,
Teaching us the true meaning of grace.',
  'en',
  1,
  'published',
  0,
  1
);

-- Poem 4: Jeevan ka Saar (Rap)
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'जीवन का सार',
  'आओ बदल दें आज तारों को सितारों को
माथे पर लिखीं बदनसीब तकदीर को

हाथों में खींची उन टेढ़ी मेढ़ी लकीरों को 
तोड़ दें पाव से बांधी सारी जंजीरों को 

आ-जाओ बदल दें आज तारों को सितारों को...
और 
कह दो चांद से, सूरज से, इस पवन से, 
जल से, धरती हो या गगन से...

पहाड़ों सा मज़बूत हैं मेरा हौसला
अडिग हैं दृढ़ हैं मेरा फैसला 
रुकूंगा नहीं झुकूंगा नहीं साला...

ऊंचाई तक शिखर तक पहुंचने की दौड़ हैं 
मेरे जैसे कई मस्ताने इस होड़ में हैं 

छू लूं आसमान मेरी उड़ान हैं 
कभी हार न मानना मेरी पहचान हैं 

ज़िंदगी की बस यही पुकार हैं 
आज की हकीक़त बस यहीं दरकार हैं 

मुश्किलों से लड़कर ही मिलती असली ख़ुशी हैं 
बहते पानी सा साफ़ मेरा ये सुविचार हैं 

आगे बढ़ते रहने का मतलब ये हैं 
हां जी हां बस यहीं खुश रहने का सार हैं',
  'hi',
  1,
  'published',
  1,
  1
);

-- Poem 5: Uljhan
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'उलझन',
  'जिंदगी की सारी,
     उलझनों को खत्म कर दूं!
             चाहते तो बहुत हैं,
   शुरुवात कहां से करु,
           बस यहीं उलझन हैं!

         यूं तो,
   जिंदगी की सारी,
     उलझनें सुलझां सक्ता हूं मैं!
     उलझन तो बस यहीं हैं,
        शुरुवात कहां से करु!',
  'hi',
  1,
  'published',
  0,
  1
);

-- Poem 6: Kurbani
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'कुर्बानी - आज के लिए कल',
  'मेरे - तुम्हारें - बच्चों के
अच्छें "कल" के लिये,
   "आज" कई, 
कुर्बान कर रहा हुं!
    
सही हैं शायद? 
  सोचता कभी मैं,
क्या गलत कर रहा हुं!',
  'hi',
  1,
  'published',
  0,
  1
);

-- Poem 7: Zindagi aisa kab tak chalega?
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'ज़िंदगी ऐसा कब तक चलेगा?',
  'ज़िंदगी ऐसा कब तक चलेगा??

तू बिखेरती रहें मैं सवारता रहूं!!
तू पहेली बुझाती रहें मैं हल करता रहूं!!
जिंदगी ऐसा कब तक चलेगा??

तू दौड़ाती रहें मैं जुझता रहूं!!
तू हंस ती रहें मैं रोता रहूं!!
जिंदगी ऐसा कब तक चलेगा??

तू लुटाती रहें मैं समेटता रहूं!!
जिंदगी आखिर ऐसा कब तक चलेगा??',
  'hi',
  1,
  'published',
  0,
  1
);

-- Poem 8: Anndekha Vishanu
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'अनदेखा विषाणु',
  'गुजर रही जिंदगी घर में कैद,
सोचता हुं अब तक क्या हासिल किया??
  
जमा करते रहे हम पैसा,
    इरादा दुनिया घुमने का था!

बांट ते रहे गये हम गम के पल,
 इरादा दुनिया में खुशियां बिखेरने का था!

जमा करते रहे हम गोला, बारुद,
    इरादा दुनिया जीतने का था!

बांट ते रहे गये हम मुश्कीलें,
    इरादा दुनिया आसान करने का था!

लिखने चले थे अपनी तकदिर लेकीन,
इरादा भगवान का कुछ और ही था!

काम तो तमाम कर गया एक छोटा 
     
     अनदेखा "विषाणू"
 
दुशमन हमारी नज़र में कोई और ही था!',
  'hi',
  1,
  'published',
  1,
  1
);

-- Poem 9: Zindagi ki Sacchai
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'जिंदगी की सच्चाई',
  'हर पल...
जिंदगी की सच्चाई से वाकिफ़ हो रहा हूं!
गुजर रहे हैं हम अंधेर नगरी से,
उम्मीद की किरन ढुंढ़ रहा हूं! 
 सफर की मंजिल(मौत) तो आनी हैं 
 - आएगी मेरी वो मेहबूबा एक दिन
 बस तब तलक...
 ज़हर के कड़वे घुंट पी कर जी रहा हूं!',
  'hi',
  1,
  'published',
  0,
  1
);

-- Poem 10: Samay se Uljhi Taarein
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'समय से उलझी तारें',
  'समय से
उलझी तारों को सुलझाने में लगे हैं
चेहरे की शिकन छिपाने में लगे हैं
चाहे दुनियां हो या हो मेरे अज़ीज़ दोस्त
कहीं वो मेरा दर्द भांप न ले,
इसीलिए
अब हम ख़ूब मुस्कुराने लगे हैं।',
  'hi',
  1,
  'published',
  0,
  1
);

-- Poem 11: Ek Din (The One Finger Vote)
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'एक दिन - एक उंगली की वोट',
  'आम जनता एक दिन एक उंगली दबाकर,
दिखाकर बड़ा सम्मानित महसूस करते हैं।
लेकिन बेचारी जनता ये भूल जाते हैं के,
उसी उंगली को तरह तरह से मोड़ कर,
सत्ताधारी पक्ष उनकी आनेवाले पांच सालों तक बजाते रहेंगे।',
  'hi',
  1,
  'published',
  0,
  1
);

-- Poem 12: Har Mod Par Seekh
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'हर मोड़ पर सीख',
  'जिंदगी हर मोड पर कुछ सिखाती!
 	ध्यान दे कर सीखों यारों,
जिंदगी चुपकेसे बहुत कुछ कह जाती!
  	ध्यान दे कर सून लो यारों,
जिंदगी जींदादीली का नाम हैं दोस्तों!
   	इसे युंही रोने में मत गुजारो,
जिंदगी में बटोर लो हंसी के पल दोस्तों!
--
 हर मोड पर कुछ सिखाती हैं जिंदगी!
 	ध्यान दे कर सीखों यारों,
 चुपकेसे बहुत कुछ कह जाती हैं जिंदगी!
  	ध्यान दे कर सून लो यारों,
जींदादीली का ही नाम हैं जिंदगी!
   	युंही रोकर इसे मत गुजारो यारों,
बटोर लो हसीन पल हंसी के जिंदगी में यारों,
    	ना जाने कब जिंदगी की शाम हो!',
  'hi',
  1,
  'published',
  0,
  1
);

-- Poem 13: Nadi ho ya Zindagi
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'नदी हो या ज़िंदगी',
  'नदी हो या ज़िंदगी --
हैं कभी वो चंचल तो कभी ठहराव संजोए,
नदियां के शीतल जल सी मिठी हैं ज़िंदगी ।
कहीं थम जाए रुक जाए तो मैली हो जाए,
बहती रहे अविरत तो निर्मल स्वच्छ और पावन हैं ज़िंदगी ।',
  'hi',
  1,
  'published',
  0,
  1
);

-- Poem 14: Guzarish to Life
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'गुज़ारिश - ज़िन्दगी से',
  'ए ज़िन्दगी
पता है मुझे मंज़िल की
चाह में हम सब दौड़ते हैं
पर दोस्त मुझे प्यारे हैं
मेरे आसमान के वो सितारे हैं
 
दोस्त अब मेरे थक गए हैं
थोड़ा तो उन्हें जीने दे
सांस तो जी भर के लेने दे
 
ए ज़िन्दगी थोड़ा तो ठहर
जी लेने दे जी लेने दे',
  'hi',
  1,
  'published',
  1,
  1
);

-- Poem 15: Hassna Zaroori Hai
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'हंसना ज़रूरी है',
  'हंसना बहुत ज़रूरी हैं --
दोस्तों से मिलते रहना ज़रूरी हैं
दुश्मन न के बराबर हो, तो सही ...
 दोस्तों से दोस्ती निभाना ज़रूरी है ...
गिर जाओ चाहे जीतने बार
उठकर दौड़ना ज़रूरी हैं,
हार मिले तुम्हे,
टूट जाओ तुम अनगिनत बार,
लेकिन हर बार खुदको समेट कर...
संघर्ष करना,
लड़ते रहना,
कर्म करते रहना.... बहुत ज़रूरी है ...
आख़िर,
कोशिशें करना, चलते रहना ही तो जिंदगी हैं !
रोने की हो चाहे लाख वजह आप के पास
फ़िर भी ...
हंसना बहुत ज़रूरी हैं !
फ़िर भी ...
हंसना बहुत ज़रूरी हैं !

|| हर बार मौत सिखाती है ...||
|| जीना कितना ज़रूरी है ...||',
  'hi',
  1,
  'published',
  1,
  1
);

-- Poem 16: Take it for Granted
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'Take it for Granted',
  'All that we do is - "Take it for Granted"
Right from birth, till the sunset of our lives
We learn to eat, drink, walk and talk,
These are essential for us to get right and get us ready for the ultimate struggle and fight for life!
However we shouldn''t
Explore, Exploit and Take it for Granted!',
  'en',
  1,
  'published',
  0,
  1
);

-- Poem 17: Raaste Kamal Hote Hain
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'रास्ते कमाल होते हैं',
  'रास्ते कमाल होते हैं!
 
   चाहे खुद कभी ना जाते कहीं,
   बेशक हमेशा ठहर जाते यहीं,
   मगर मंजिल तक राहगिर को,
	हर बार पहुचाते सलामत और सही!
	गलती तो इंसानो से होती हैं,
	रास्तों को परख़ने में,
होते रास्ते भले ही बेजुबान पर,
रास्तें कमाल होते हैं!
	होते उबड़-खाबड़ ये कहीं,
	होते सीधे-सादे ये कहीं,
	जैसे भी हो - सीख जिंदगी की
	लाजवाब देते हैं!
	चुपचाप सहते जुल्म ये सभी के,
 	पर मुश्किल हमारी आसान कर देते हैं!
होते रास्तें भले ही बेजुबान पर,
   रास्ते कमाल होते हैं!',
  'hi',
  1,
  'published',
  0,
  1
);

-- Poem 18: Aagaz (2024)
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'आगाज़ - 2024',
  'आज़ाद --
मुद्दत्तों से दिल के पिंजरे में कैद,
कई अधूरे...
सपनों के पंछीयों को,
जंजीरों में बंधे अनकही ख्वाइशों के परिंदों को,
चलों आज खुले आसमान में उड़ने को
" आज़ाद "
करते हैं ।
चलों नए साल में,
एक धमाकेदार
" आगाज़ "
करते हैं।
२०२४ को २०२३ से और भी बेहतर
" अंजाम "
 करते हैं।
नए साल की प्यार भरी शुभकामनाएं।
 
-----
आज़ाद हो कर आज सुकून महसूस हुआ
खुले आसमान में उड़ान भरने के लिए तैयार हैं
पंख हैं तैयार हवा से बातें करने लगे हैं
अब उच्चाई से डर नहीं रहा
गिरने का भी नहीं
ज़मीन से ऊपर बस',
  'hi',
  1,
  'published',
  0,
  1
);

-- Poem 19: Badalta Insaan
INSERT INTO poems (title, content, language, author_id, status, is_featured, anthology_eligible)
VALUES (
  'बदलता इंसान',
  'बदलता इंसान --
मन में कई दिनों से एक सवाल गुंजता हैं,
के इंसान और वक्त में आखिर क्या समानता हैं ??
 
कुछ समय ढूंढने पर जवाब मिला....
 
वक्त हमेशा एक सा नहीं रहता,
इंसान की फितरत (या क़िस्मत) की तरह,
 एक दिन बदलता ज़रूर हैं।',
  'hi',
  1,
  'published',
  0,
  1
);
