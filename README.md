# KvistAndBjaelke_Login
## Security
### 1.2
#### Authentication
Vi bruger JWT(JSON Web Token) til authentication. Når du logger ind bliver der genereret en token, som bruger en secret key på mindst 32 tegn, der virker i en time. Den token bliver brugt til at authenticate. Tokenet har users roller og id.

#### Passwords
Vores kodeord bliver aldrig vist i plaintext. Vi bruger argon2id til at hashe dem, hvor de får et salt og et hash. De bliver stored i databasen, og selv hvis databasen bliver hacket, er det kun den krypteret kode der er gemt. Vi kunne istedet for Argon2id have brugt Bcrypt, da vi også før har brugt det, men vi mente at Argon2Id var bedst i denne situation.

#### Screenshots

Forkert login:

<img width="1916" height="1032" alt="Login-fail" src="https://github.com/user-attachments/assets/f9d93e25-5f20-4ec9-b45d-ac6e26f5de02" />

User siden, hvor de kun ser andre users.

<img width="1912" height="1032" alt="User-tabel" src="https://github.com/user-attachments/assets/862c0af3-8f1d-4723-841e-807d94ba7db0" />

Super user siden, hvor de kan lave users, se users og superusers, og redigere og slette users:

<img width="1917" height="1027" alt="Super-user-tabel" src="https://github.com/user-attachments/assets/495729ff-24ec-4cee-9f62-9f4311d0261c" />

Admin siden, hvor man kan lave users, superusers og admins, og slette og redigere alle:

<img width="1911" height="1027" alt="admin-tabel" src="https://github.com/user-attachments/assets/cf3711d6-98dd-42af-a97d-606f9d33beb3" />

Lave en ny user:

<img width="441" height="520" alt="create-user-new" src="https://github.com/user-attachments/assets/b077c309-1195-4bc7-aa6a-392d73cbec74" />


## Infrastructure
### 2.1.1
| ID  | Navn     | Enheder (nu -> med vækst) | Subnet       | Gateway   | DHCP eller statisk       |
|-----|----------|---------------------------|--------------|-----------|--------------------------|
| 570 | CLIENTS  | 25 -> 50                  | 10.5.71.0/24 | 10.5.70.1 | DHCP (.50-.250), statisk |
| 571 | SERVERS  | 3-6                       | 10.5.71.0/24 | 10.5.71.1 | Statisk                  |
| 572 | PRINTERS | 3-6                       | 10.5.72.0/28 | 10.5.72.1 | Statisk                  |
| 573 | VOICE    | 12-24                     | 10.5.73.0/26 | 10.5.73.1 | DHCP                     |
| 574 | CAMERAS  | 6-12                      | 10.5.74.0/27 | 10.5.74.1 | Statisk                  |
| 575 | GUEST    | 50-100                    | 10.5.75.0/24 | 10.5.75.1 | DHCP                     |

Vi har valgt at dele vores netværk op i flere VLAN, istedet for at have et stort net. Grunden til dette er, at hvis en af enhederne bliver hacket så vil det ikke kunne nå alt det andet. Det giver dermed også mindre net, mindre unødvendig trafik og et bedre overblik.

### 2.1.2
| Netværk       | Netværksadresse | Subnetmaske           | Brugbare hosts | Hostområde | Broadcast |
|---------------|-----------------|-----------------------|----------------|------------|-----------|
| CLIENTS (570) | 10.5.70.0       | 255.255.255.0 (/24)   | 254            | .1-.254    | .255      |
| VOICE (573)   | 10.5.73.0       | 255.255.255.192 (/26) | 62             | .1-.62     | .63       |

Clients: 25 enheder i dag og 50 med vækst
VOICE: 12 telefoner i dag og 24 med vækst

Fremtidig udvidelse: Begger net har mindst dobbelt så mange adresser, som de skal bruge efter væksten. Hvert VLAN har sit eget område så det kan nemt gøres større ved at ændre præfikset.

### 2.6
#### Server

Ubuntu versionen er installeret:

<img width="322" height="115" alt="ubuntu version" src="https://github.com/user-attachments/assets/70628968-6889-4c7e-bba5-9d190d956d52" />

Ip-a adressen og ip-r adressen:

<img width="995" height="670" alt="Ip-Adresse (ip-a og ip-r)" src="https://github.com/user-attachments/assets/8e759d20-3ef0-4eb0-848b-353b303de87b" />

Docker og Docker Compose version:

<img width="397" height="78" alt="Docker-og-dockercompose" src="https://github.com/user-attachments/assets/5fefb5ab-d05d-4d89-94eb-ce193f48333d" />

Docker der virker:

<img width="722" height="450" alt="Docker-virker" src="https://github.com/user-attachments/assets/3b16b4a1-cb18-42ce-bb2d-372e7130f032" />

Platformen kører i containere:

<img width="1281" height="115" alt="Platformen-i-containere" src="https://github.com/user-attachments/assets/9dc3dce6-b5c3-48e5-86cb-23d80a3bb3ca" />

Tilgængeligt lokalt (det er en rigtig token der bliver vist):

<img width="1273" height="157" alt="Tilgængeligt-lokalt" src="https://github.com/user-attachments/assets/3027ed31-8265-4bb9-9017-14738be67f18" />

Projekt mappe og compose fil:

<img width="462" height="45" alt="Projektmappe-og-compose-fil" src="https://github.com/user-attachments/assets/72cbbb8b-d2b0-468a-a930-46301817c6e4" />

#### Klient

IP-konfiguration:

<img width="827" height="446" alt="Ip-konfiguration-klient" src="https://github.com/user-attachments/assets/4c1ccc33-ddc9-454a-93ee-4a56a2be48de" />

Forbindelse til serveren:
<img width="1132" height="377" alt="Forbindelse-normal" src="https://github.com/user-attachments/assets/2d08e79f-fa22-4d08-ae46-8ecd61c74824" />

<img width="1117" height="392" alt="Forbindelse-Login" src="https://github.com/user-attachments/assets/a2778f14-eb4e-4376-80f5-67f07cd1114d" />

Browseren med adressebjælken:

<img width="1608" height="837" alt="login-page" src="https://github.com/user-attachments/assets/e000eaca-1e71-478d-831e-57024b0798b6" />

<img width="1602" height="837" alt="Admin-page" src="https://github.com/user-attachments/assets/82bd6b5a-1134-4918-b2e9-4ec84100fe5d" />

<img width="1601" height="828" alt="Create-User" src="https://github.com/user-attachments/assets/b8ce908b-e3c0-4d05-af83-3b33a5f0e975" />

<img width="1606" height="832" alt="Super-user-page" src="https://github.com/user-attachments/assets/d56d9727-559c-4d6c-a300-c63331a0ad6a" />

<img width="1607" height="836" alt="User-page" src="https://github.com/user-attachments/assets/bc2622b3-f965-4eec-a28c-6a5be8c3fedb" />

## Problemer vi har døjet med
Netværkskortet på vores ubuntu live server virkede ligepludselig ikke, og derfor blev vi nødt til at få hjælp af Henrik, til at få det geninstallerede.
