# spanins-frontend [![Docker Repository on Quay](https://quay.io/repository/tamu_cpt/spanindb-frontend/status "Docker Repository on Quay")](https://quay.io/repository/tamu_cpt/spanindb-frontend)

This front end to https://github.com/elenimijalis/spanins was build using AngularJS.

## Usage
In app:
```console
$ bower install
$ python -m SimpleHTTPServer 8080
```

## Features
#### Searchable table of spanins
* Optional filter for spanin type (overlapping, embedded, sepaprate, or unimolecular)

![](/images/table.png)

#### Detail spanin view
![](/images/detail.png)

#### Heatmap showing Shine-Dalgarno sequence frequencies
  - ois/oos: overlapping i/o spanins
  - eis/eos: embedded i/o spanins
  - sis/sos: separate i/o spanins
  - us:      unimolecular spanins

![](/images/heatmap.png)
