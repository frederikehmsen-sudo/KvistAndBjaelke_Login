# KvistAndBjaelke_Login
## Security
### 1.2


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

<img width="322" height="115" alt="ubuntu version" src="https://github.com/user-attachments/assets/70628968-6889-4c7e-bba5-9d190d956d52" />
