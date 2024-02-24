---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==


# Text Elements
Machine 1 ^tg1PcPrJ

ES process 01 ^aFHRz3Jy

Shard01
Primary ^ev94QOpu

Memory Buffer ^AlKTFWa7

OS Cache ^2rt4EuLS

Segment file
(Disk file) ^PH9aU3Gd

Commit Point
(Disk file) ^CSBDq99Z

Translog (Disk file) ^RtcT8xDL

Write to the memory buffer 
and os cache at the same time
 ^e7QCrS0m

Every 1s, refresh to os cache
 ^P8hxh9NL

fsync ^xouZgqak

After data is refreshed to os cache
 it can be searched.
The memory buffer will be cleared
 ^C1fihX8i

Every 5s, translog is written to os cache 
(so there may be 5s of data loss during downtime)
 ^dI0MSjZz

When translog reaches a certain threshold, 
commit (flush) is triggered ^uwCGkr2r

Flushe every 30 minutes by default ^clTop8ro

1. Flush buffer data to os cache
2. os cache fsync force flash to segment file, write
commit point
3. Clear translog and restart one
 ^e7kfweJm

Shard03
Replica ^VRpDL4XV

%%
# Drawing
```json
{
	"type": "excalidraw",
	"version": 2,
	"source": "https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/1.9.18",
	"elements": [
		{
			"id": "61-3FzJZQz1kZGcPhbew8",
			"type": "rectangle",
			"x": -552.8391018161525,
			"y": -324.50995685729583,
			"width": 1271.9787090351056,
			"height": 956.4996348291235,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1234351055,
			"version": 501,
			"versionNonce": 488563169,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658143591,
			"link": null,
			"locked": false
		},
		{
			"id": "tg1PcPrJ",
			"type": "text",
			"x": 37.15079752604174,
			"y": -296.8125824510006,
			"width": 88.65994262695312,
			"height": 25,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 1355828641,
			"version": 138,
			"versionNonce": 1977402049,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658186689,
			"link": null,
			"locked": false,
			"text": "Machine 1",
			"rawText": "Machine 1",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "top",
			"baseline": 18,
			"containerId": null,
			"originalText": "Machine 1",
			"lineHeight": 1.25
		},
		{
			"id": "HMNJZFUfjB4t5rvHihlmH",
			"type": "rectangle",
			"x": -219.15662413758122,
			"y": -248.11556574907536,
			"width": 636.4365488027598,
			"height": 307.45378272794284,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 756926337,
			"version": 618,
			"versionNonce": 367435169,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658143591,
			"link": null,
			"locked": false
		},
		{
			"id": "aFHRz3Jy",
			"type": "text",
			"x": 24.367431640625,
			"y": -225.49794514973962,
			"width": 137.0598907470703,
			"height": 25,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 1525027937,
			"version": 144,
			"versionNonce": 291783041,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658143591,
			"link": null,
			"locked": false,
			"text": "ES process 01",
			"rawText": "ES process 01",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "top",
			"baseline": 18,
			"containerId": null,
			"originalText": "ES process 01",
			"lineHeight": 1.25
		},
		{
			"id": "1uHj0MMb25QMhegeRF3fd",
			"type": "rectangle",
			"x": -54.26448197798288,
			"y": -167.51192220052098,
			"width": 115,
			"height": 74,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 200493967,
			"version": 211,
			"versionNonce": 960653665,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "ev94QOpu"
				},
				{
					"id": "n2sU2DHTreKVbVWMK1itd",
					"type": "arrow"
				},
				{
					"id": "meeauMVCsL33n0ume3j4m",
					"type": "arrow"
				},
				{
					"id": "oYlBbAlw5cy6q2pW6LNf9",
					"type": "arrow"
				}
			],
			"updated": 1708658143591,
			"link": null,
			"locked": false
		},
		{
			"id": "ev94QOpu",
			"type": "text",
			"x": -34.034455732865695,
			"y": -155.51192220052098,
			"width": 74.53994750976562,
			"height": 50,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 1014282863,
			"version": 190,
			"versionNonce": 919639361,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658143591,
			"link": null,
			"locked": false,
			"text": "Shard01\nPrimary",
			"rawText": "Shard01\nPrimary",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 43,
			"containerId": "1uHj0MMb25QMhegeRF3fd",
			"originalText": "Shard01\nPrimary",
			"lineHeight": 1.25
		},
		{
			"id": "mPV1L5GjjLg9Y_V6AbHqd",
			"type": "rectangle",
			"x": -170.76247257381306,
			"y": -36.85142193418551,
			"width": 164,
			"height": 60,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 2065284079,
			"version": 332,
			"versionNonce": 1448045761,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "AlKTFWa7"
				},
				{
					"id": "n2sU2DHTreKVbVWMK1itd",
					"type": "arrow"
				},
				{
					"id": "oSZi7SKT5Bd1adAoEGaq_",
					"type": "arrow"
				}
			],
			"updated": 1708658143591,
			"link": null,
			"locked": false
		},
		{
			"id": "AlKTFWa7",
			"type": "text",
			"x": -160.19240421443806,
			"y": -19.35142193418551,
			"width": 142.85986328125,
			"height": 25,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 813870945,
			"version": 333,
			"versionNonce": 1713777825,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658143591,
			"link": null,
			"locked": false,
			"text": "Memory Buffer",
			"rawText": "Memory Buffer",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 18,
			"containerId": "mPV1L5GjjLg9Y_V6AbHqd",
			"originalText": "Memory Buffer",
			"lineHeight": 1.25
		},
		{
			"id": "8EYtXCfDzAbOMRBGxzWqQ",
			"type": "rectangle",
			"x": -154.42272302571496,
			"y": 140.53315291596994,
			"width": 132,
			"height": 49,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 376593601,
			"version": 196,
			"versionNonce": 1785527873,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "2rt4EuLS"
				},
				{
					"id": "oSZi7SKT5Bd1adAoEGaq_",
					"type": "arrow"
				},
				{
					"id": "_fQvSjlgyASMVUI_fu-XS",
					"type": "arrow"
				},
				{
					"id": "gqoPSqOtHK46W3EJeJEPO",
					"type": "arrow"
				},
				{
					"id": "meeauMVCsL33n0ume3j4m",
					"type": "arrow"
				}
			],
			"updated": 1708660262919,
			"link": null,
			"locked": false
		},
		{
			"id": "2rt4EuLS",
			"type": "text",
			"x": -135.3026897615548,
			"y": 152.53315291596994,
			"width": 93.75993347167969,
			"height": 25,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 1749591297,
			"version": 188,
			"versionNonce": 328568353,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708660262919,
			"link": null,
			"locked": false,
			"text": "OS Cache",
			"rawText": "OS Cache",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 18,
			"containerId": "8EYtXCfDzAbOMRBGxzWqQ",
			"originalText": "OS Cache",
			"lineHeight": 1.25
		},
		{
			"type": "rectangle",
			"version": 321,
			"versionNonce": 1282449281,
			"isDeleted": false,
			"id": "OhkVcShjpxiXv24gl3dFA",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -155.7948822139689,
			"y": 300.5141285192075,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 159,
			"height": 71,
			"seed": 345642031,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "PH9aU3Gd"
				},
				{
					"id": "_fQvSjlgyASMVUI_fu-XS",
					"type": "arrow"
				}
			],
			"updated": 1708658143591,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 347,
			"versionNonce": 1326647137,
			"isDeleted": false,
			"id": "PH9aU3Gd",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -135.12482300986733,
			"y": 311.0141285192075,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 117.65988159179688,
			"height": 50,
			"seed": 533050959,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1708658143591,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 1,
			"text": "Segment file\n(Disk file)",
			"rawText": "Segment file\n(Disk file)",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "OhkVcShjpxiXv24gl3dFA",
			"originalText": "Segment file\n(Disk file)",
			"lineHeight": 1.25,
			"baseline": 43
		},
		{
			"type": "rectangle",
			"version": 326,
			"versionNonce": 305095457,
			"isDeleted": false,
			"id": "aJTecFSKZAY7TEl6jhkzk",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -12.239404052122495,
			"y": 463.5398478217918,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 159,
			"height": 71,
			"seed": 297311073,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "CSBDq99Z"
				},
				{
					"id": "oYlBbAlw5cy6q2pW6LNf9",
					"type": "arrow"
				}
			],
			"updated": 1708658143591,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 371,
			"versionNonce": 1668830977,
			"isDeleted": false,
			"id": "CSBDq99Z",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 5.120657593385317,
			"y": 474.0398478217918,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 124.27987670898438,
			"height": 50,
			"seed": 1169196865,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1708658143591,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 1,
			"text": "Commit Point\n(Disk file)",
			"rawText": "Commit Point\n(Disk file)",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "aJTecFSKZAY7TEl6jhkzk",
			"originalText": "Commit Point\n(Disk file)",
			"lineHeight": 1.25,
			"baseline": 43
		},
		{
			"type": "rectangle",
			"version": 296,
			"versionNonce": 1610435265,
			"isDeleted": false,
			"id": "iaWP8H1tasHfe3diOM10V",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 296.98670159507424,
			"y": 216.80396935999045,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 221,
			"height": 58,
			"seed": 450393647,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "RtcT8xDL"
				},
				{
					"id": "gqoPSqOtHK46W3EJeJEPO",
					"type": "arrow"
				}
			],
			"updated": 1708658143591,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 342,
			"versionNonce": 2053655201,
			"isDeleted": false,
			"id": "RtcT8xDL",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 312.22679101157814,
			"y": 233.30396935999045,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 190.5198211669922,
			"height": 25,
			"seed": 1407703119,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1708658143591,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 1,
			"text": "Translog (Disk file)",
			"rawText": "Translog (Disk file)",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "iaWP8H1tasHfe3diOM10V",
			"originalText": "Translog (Disk file)",
			"lineHeight": 1.25,
			"baseline": 18
		},
		{
			"id": "n2sU2DHTreKVbVWMK1itd",
			"type": "arrow",
			"x": -5.015465335935765,
			"y": -91.25035247142205,
			"width": 49.32536765919398,
			"height": 51.40034465046688,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 552341039,
			"version": 388,
			"versionNonce": 684433487,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658143658,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-18.433176354405,
					34.694626052658464
				],
				[
					-49.32536765919398,
					51.40034465046688
				]
			],
			"lastCommittedPoint": [
				-98.8864650974026,
				53.51942978896102
			],
			"startBinding": {
				"elementId": "1uHj0MMb25QMhegeRF3fd",
				"focus": -0.16341270090210547,
				"gap": 2.2615697290989374
			},
			"endBinding": {
				"elementId": "e7QCrS0m",
				"focus": 0.9269695766753635,
				"gap": 7.914995069627537
			},
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "meeauMVCsL33n0ume3j4m",
			"type": "arrow",
			"x": 23.116033247634782,
			"y": -89.29511369977695,
			"width": 44.985268027572715,
			"height": 228.84659135016136,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 223030849,
			"version": 939,
			"versionNonce": 1575024033,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708660262919,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					2.698405859721852,
					123.10629576315614
				],
				[
					-42.28686216785086,
					228.84659135016136
				]
			],
			"lastCommittedPoint": [
				26.026341822240283,
				221.49753322849028
			],
			"startBinding": {
				"elementId": "1uHj0MMb25QMhegeRF3fd",
				"focus": -0.32544573352558037,
				"gap": 4.216808500744037
			},
			"endBinding": {
				"elementId": "8EYtXCfDzAbOMRBGxzWqQ",
				"focus": 0.764313432729706,
				"gap": 3.3968369993923346
			},
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "oYlBbAlw5cy6q2pW6LNf9",
			"type": "arrow",
			"x": 63.942674512987224,
			"y": -122.09201389831878,
			"width": 83.60577131216607,
			"height": 578.7626809334495,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 736037807,
			"version": 842,
			"versionNonce": 2136116975,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658143658,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					54.5984933035713,
					143.78584147373806
				],
				[
					-29.007278008594774,
					578.7626809334495
				]
			],
			"lastCommittedPoint": [
				-1.9090528612013031,
				486.16420200892867
			],
			"startBinding": {
				"elementId": "1uHj0MMb25QMhegeRF3fd",
				"focus": -0.8037764195542345,
				"gap": 3.2071564909701067
			},
			"endBinding": {
				"elementId": "aJTecFSKZAY7TEl6jhkzk",
				"focus": -0.4688055294631579,
				"gap": 6.869180786661104
			},
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "oSZi7SKT5Bd1adAoEGaq_",
			"type": "arrow",
			"x": -88.23278332995119,
			"y": 26.79430571056526,
			"width": 37.94530739421056,
			"height": 111.7229747620114,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 454189519,
			"version": 421,
			"versionNonce": 1289822721,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708660262919,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					21.59460541000942,
					48.44832751712374
				],
				[
					37.94530739421056,
					111.7229747620114
				]
			],
			"lastCommittedPoint": [
				55.84558264001623,
				108.16808923498377
			],
			"startBinding": {
				"elementId": "mPV1L5GjjLg9Y_V6AbHqd",
				"focus": 0.15169101409423308,
				"gap": 3.645727644750771
			},
			"endBinding": {
				"elementId": "8EYtXCfDzAbOMRBGxzWqQ",
				"focus": 0.621962477300939,
				"gap": 2.0158724433932775
			},
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "_fQvSjlgyASMVUI_fu-XS",
			"type": "arrow",
			"x": -76.89609831359624,
			"y": 191.54063447859676,
			"width": 32.48119968995589,
			"height": 100.39575506815754,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 276701633,
			"version": 299,
			"versionNonce": 592394721,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708660262919,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					1.6173531329957598,
					28.06782525828089
				],
				[
					32.48119968995589,
					100.39575506815754
				]
			],
			"lastCommittedPoint": [
				5.273120434253315,
				58.42419909192381
			],
			"startBinding": {
				"elementId": "8EYtXCfDzAbOMRBGxzWqQ",
				"focus": -0.1483299454400617,
				"gap": 2.007481562626822
			},
			"endBinding": {
				"elementId": "OhkVcShjpxiXv24gl3dFA",
				"focus": 0.5355481524236444,
				"gap": 8.577738972453176
			},
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "e7QCrS0m",
			"type": "text",
			"x": -376.33560101397603,
			"y": -101.6291588457118,
			"width": 314.07977294921875,
			"height": 75,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 2139086081,
			"version": 320,
			"versionNonce": 707837551,
			"isDeleted": false,
			"boundElements": [
				{
					"id": "n2sU2DHTreKVbVWMK1itd",
					"type": "arrow"
				}
			],
			"updated": 1708658143658,
			"link": null,
			"locked": false,
			"text": "Write to the memory buffer \nand os cache at the same time\n",
			"rawText": "Write to the memory buffer \nand os cache at the same time\n",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "top",
			"baseline": 68,
			"containerId": null,
			"originalText": "Write to the memory buffer \nand os cache at the same time\n",
			"lineHeight": 1.25
		},
		{
			"id": "P8hxh9NL",
			"type": "text",
			"x": -402.60106647288944,
			"y": 77.72599089164646,
			"width": 292.3797607421875,
			"height": 50,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 1149808705,
			"version": 186,
			"versionNonce": 476764577,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658143591,
			"link": null,
			"locked": false,
			"text": "Every 1s, refresh to os cache\n",
			"rawText": "Every 1s, refresh to os cache\n",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "top",
			"baseline": 43,
			"containerId": null,
			"originalText": "Every 1s, refresh to os cache\n",
			"lineHeight": 1.25
		},
		{
			"id": "xouZgqak",
			"type": "text",
			"x": -39.366968229219424,
			"y": 230.791289358428,
			"width": 49.33995056152344,
			"height": 25,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 1696383553,
			"version": 82,
			"versionNonce": 872480129,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658143591,
			"link": null,
			"locked": false,
			"text": "fsync",
			"rawText": "fsync",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "top",
			"baseline": 18,
			"containerId": null,
			"originalText": "fsync",
			"lineHeight": 1.25
		},
		{
			"id": "C1fihX8i",
			"type": "text",
			"x": -540.7625971333696,
			"y": 129.16081630300937,
			"width": 368.69970703125,
			"height": 100,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 570476847,
			"version": 204,
			"versionNonce": 1197707137,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708660260168,
			"link": null,
			"locked": false,
			"text": "After data is refreshed to os cache\n it can be searched.\nThe memory buffer will be cleared\n",
			"rawText": "After data is refreshed to os cache\n it can be searched.\nThe memory buffer will be cleared\n",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "top",
			"baseline": 93,
			"containerId": null,
			"originalText": "After data is refreshed to os cache\n it can be searched.\nThe memory buffer will be cleared\n",
			"lineHeight": 1.25
		},
		{
			"id": "dI0MSjZz",
			"type": "text",
			"x": 191.73813883463572,
			"y": 139.2292905448105,
			"width": 504.9195556640625,
			"height": 75,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 643976143,
			"version": 250,
			"versionNonce": 369954049,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708661965829,
			"link": null,
			"locked": false,
			"text": "Every 5s, translog is written to os cache \n(so there may be 5s of data loss during downtime)\n",
			"rawText": "Every 5s, translog is written to os cache \n(so there may be 5s of data loss during downtime)\n",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "top",
			"baseline": 68,
			"containerId": null,
			"originalText": "Every 5s, translog is written to os cache \n(so there may be 5s of data loss during downtime)\n",
			"lineHeight": 1.25
		},
		{
			"id": "gqoPSqOtHK46W3EJeJEPO",
			"type": "arrow",
			"x": -17.723176905331485,
			"y": 169.78130712297968,
			"width": 312.93216061282453,
			"height": 75.72542599588564,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 1897963553,
			"version": 270,
			"versionNonce": 1475302849,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708660262919,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					149.03020435054256,
					48.95363648159275
				],
				[
					312.93216061282453,
					75.72542599588564
				]
			],
			"lastCommittedPoint": [
				269.12112545657476,
				79.97650542816564
			],
			"startBinding": {
				"elementId": "8EYtXCfDzAbOMRBGxzWqQ",
				"focus": -0.4000740292584442,
				"gap": 4.699546120383502
			},
			"endBinding": {
				"elementId": "iaWP8H1tasHfe3diOM10V",
				"focus": -0.38347676065118796,
				"gap": 1.7777178875811614
			},
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "uwCGkr2r",
			"type": "text",
			"x": 223.56178289601598,
			"y": 285.82618494700876,
			"width": 435.07965087890625,
			"height": 50,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 876119361,
			"version": 160,
			"versionNonce": 686404865,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658143591,
			"link": null,
			"locked": false,
			"text": "When translog reaches a certain threshold, \ncommit (flush) is triggered",
			"rawText": "When translog reaches a certain threshold, \ncommit (flush) is triggered",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "top",
			"baseline": 43,
			"containerId": null,
			"originalText": "When translog reaches a certain threshold, \ncommit (flush) is triggered",
			"lineHeight": 1.25
		},
		{
			"id": "clTop8ro",
			"type": "text",
			"x": 252.1394263072176,
			"y": 351.3387517644427,
			"width": 351.1596984863281,
			"height": 25,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 280212417,
			"version": 88,
			"versionNonce": 919432417,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658143591,
			"link": null,
			"locked": false,
			"text": "Flushe every 30 minutes by default",
			"rawText": "Flushe every 30 minutes by default",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "center",
			"verticalAlign": "top",
			"baseline": 18,
			"containerId": null,
			"originalText": "Flushe every 30 minutes by default",
			"lineHeight": 1.25
		},
		{
			"id": "e7kfweJm",
			"type": "text",
			"x": 176.2923287430557,
			"y": 445.526919938785,
			"width": 515.9595336914062,
			"height": 125,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 1017772481,
			"version": 106,
			"versionNonce": 44146319,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1708658201852,
			"link": null,
			"locked": false,
			"text": "1. Flush buffer data to os cache\n2. os cache fsync force flash to segment file, write\ncommit point\n3. Clear translog and restart one\n",
			"rawText": "1. Flush buffer data to os cache\n2. os cache fsync force flash to segment file, write\ncommit point\n3. Clear translog and restart one\n",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 118,
			"containerId": null,
			"originalText": "1. Flush buffer data to os cache\n2. os cache fsync force flash to segment file, write\ncommit point\n3. Clear translog and restart one\n",
			"lineHeight": 1.25
		},
		{
			"type": "rectangle",
			"version": 225,
			"versionNonce": 934176929,
			"isDeleted": false,
			"id": "Nhw5JxxfjChMpUdBSVAPi",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 177.19698593963574,
			"y": -163.76943679778333,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 115,
			"height": 74,
			"seed": 640894319,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "VRpDL4XV"
				}
			],
			"updated": 1708658143591,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 220,
			"versionNonce": 1576709249,
			"isDeleted": false,
			"id": "VRpDL4XV",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 193.32701371063183,
			"y": -151.76943679778333,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 82.73994445800781,
			"height": 50,
			"seed": 564576143,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1708658143591,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 1,
			"text": "Shard03\nReplica",
			"rawText": "Shard03\nReplica",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "Nhw5JxxfjChMpUdBSVAPi",
			"originalText": "Shard03\nReplica",
			"lineHeight": 1.25,
			"baseline": 43
		},
		{
			"id": "FAm8bMcS",
			"type": "text",
			"x": 398.95608339029366,
			"y": 746.7937742082479,
			"width": 10,
			"height": 25,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 839635425,
			"version": 2,
			"versionNonce": 491162319,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1708658360933,
			"link": null,
			"locked": false,
			"text": "",
			"rawText": "",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 18,
			"containerId": null,
			"originalText": "",
			"lineHeight": 1.25
		},
		{
			"id": "19wHduYc",
			"type": "text",
			"x": 511.23678514467986,
			"y": 136.26745841877369,
			"width": 10,
			"height": 25,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 668779713,
			"version": 2,
			"versionNonce": 1575506415,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1708661948253,
			"link": null,
			"locked": false,
			"text": "",
			"rawText": "",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 18,
			"containerId": null,
			"originalText": "",
			"lineHeight": 1.25
		}
	],
	"appState": {
		"theme": "dark",
		"viewBackgroundColor": "#ffffff",
		"currentItemStrokeColor": "#1e1e1e",
		"currentItemBackgroundColor": "transparent",
		"currentItemFillStyle": "hachure",
		"currentItemStrokeWidth": 1,
		"currentItemStrokeStyle": "solid",
		"currentItemRoughness": 1,
		"currentItemOpacity": 100,
		"currentItemFontFamily": 1,
		"currentItemFontSize": 20,
		"currentItemTextAlign": "left",
		"currentItemStartArrowhead": null,
		"currentItemEndArrowhead": "arrow",
		"scrollX": 731.745670995672,
		"scrollY": 1038.732541581227,
		"zoom": {
			"value": 0.5699999999999996
		},
		"currentItemRoundness": "round",
		"gridSize": null,
		"currentStrokeOptions": null,
		"previousGridSize": null,
		"frameRendering": {
			"enabled": true,
			"clip": true,
			"name": true,
			"outline": true
		}
	},
	"files": {}
}
```
%%